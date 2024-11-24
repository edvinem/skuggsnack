from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import pymongo
from typing import List
from pymongo.errors import ConnectionFailure
from fastapi.security import OAuth2PasswordBearer

# Configuration
SECRET_KEY = "amFnaGFyZW5qw6R2bGFtYXNzYW55Y2tsYXJpY2xlYXJ0ZXh0cMOlbWluc2VydmVy"  # Replace with your actual secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# MongoDB connection
client = pymongo.MongoClient(
    "mongodb://mongodb:27017/skuggsnack",
    maxPoolSize=50,  # Adjust based on your load
    minPoolSize=10
)

db = client["skuggsnack"]
users_collection = db["users"]

class UserIn(BaseModel):
    username: str
    password: str

class UserInDB(BaseModel):
    username: str
    hashed_password: str
    friends: List[str] = []
    friend_requests: List[str] = []

class UserOut(BaseModel):
    username: str
    friends: List[str] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class Message(BaseModel):
    message: str

class FriendRequest(BaseModel):
    friend_username: str

class AcceptFriendRequest(BaseModel):
    requesting_username: str

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(username: str, password: str):
    user = users_collection.find_one({"username": username})
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# API Endpoints
@app.post("/auth/register", response_model=Message)
def register(user: UserIn):
    try:
        if users_collection.find_one({"username": user.username}):
            raise HTTPException(status_code=400, detail="Username already exists")
        hashed_password = get_password_hash(user.password)
        user_data = {
            "username": user.username,
            "hashed_password": hashed_password,
            "friends": [],
            "friend_requests": []
        }
        users_collection.insert_one(user_data)
        return {"message": "User registered successfully"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.post("/auth/login", response_model=Token)
def login(user: UserIn):
    try:
        print("Received payload:", user.dict())  # Debugging log
        db_user = users_collection.find_one({"username": user.username})
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        hashed_password = db_user.get("hashed_password")
        if not hashed_password:
            raise HTTPException(status_code=400, detail="Password not set for user.")
        
        if not verify_password(user.password, hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        token_data = {"sub": user.username}
        token = create_access_token(data=token_data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": token, "token_type": "bearer"}
    except ValidationError as e:
        print("Validation error:", e.json())  # Debugging log
        raise HTTPException(status_code=422, detail="Invalid input format")
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.get("/auth/me")
def get_current_user(token: str = Depends(oauth2_scheme)):
    username = verify_token(token)
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"username": user["username"], "friends": user.get("friends", [])}

@app.post("/auth/add_friend", response_model=Message)
def add_friend(friend_username: str, token: str = Depends(oauth2_scheme)):
    current_username = verify_token(token)
    if friend_username == current_username:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a friend.")
    friend_user = users_collection.find_one({"username": friend_username})
    if not friend_user:
        raise HTTPException(status_code=404, detail="User not found.")

    users_collection.update_one(
        {"username": current_username},
        {"$addToSet": {"friends": friend_username}}
    )
    return {"message": "Friend added successfully."}

@app.get("/auth/friends", response_model=List[str])
def get_friends(token: str = Depends(oauth2_scheme)):
    current_username = verify_token(token)
    user = users_collection.find_one({"username": current_username})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return user.get("friends", [])

@app.get("/auth/friend_requests", response_model=List[str])
def get_friend_requests(token: str = Depends(oauth2_scheme)):
    current_username = verify_token(token)
    user = users_collection.find_one({"username": current_username})
    return user.get("friend_requests", [])

@app.post("/auth/send_friend_request", response_model=Message)
def send_friend_request(request: FriendRequest, token: str = Depends(oauth2_scheme)):
    current_username = verify_token(token)
    friend_username = request.friend_username
    if friend_username == current_username:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a friend.")
    friend_user = users_collection.find_one({"username": friend_username})
    if not friend_user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Check if already friends
    if current_username in friend_user.get("friends", []):
        raise HTTPException(status_code=400, detail="You are already friends with this user.")

    # Check if request already sent
    if current_username in friend_user.get("friend_requests", []):
        raise HTTPException(status_code=400, detail="Friend request already sent.")

    users_collection.update_one(
        {"username": friend_username},
        {"$addToSet": {"friend_requests": current_username}}
    )
    return {"message": "Friend request sent."}

@app.post("/auth/accept_friend_request", response_model=Message)
def accept_friend_request(request: AcceptFriendRequest, token: str = Depends(oauth2_scheme)):
    current_username = verify_token(token)
    requesting_username = request.requesting_username
    user = users_collection.find_one({"username": current_username})

    if requesting_username not in user.get("friend_requests", []):
        raise HTTPException(status_code=400, detail="No friend request from this user.")

    # Add each other as friends
    users_collection.update_one(
        {"username": current_username},
        {
            "$pull": {"friend_requests": requesting_username},
            "$addToSet": {"friends": requesting_username}
        }
    )
    users_collection.update_one(
        {"username": requesting_username},
        {"$addToSet": {"friends": current_username}}
    )
    return {"message": "Friend request accepted."}

# Health Check Endpoint
@app.get("/health")
def health_check():
    try:
        # Attempt a simple operation to verify database connectivity
        client.admin.command('ping')
        return {"status": "healthy"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Database connection failed.")