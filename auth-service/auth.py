from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import pymongo
from pymongo.errors import ConnectionFailure
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# Configuration
SECRET_KEY = "amFnaGFyZW5qw6R2bGFtYXNzYW55Y2tsYXJpY2xlYXJ0ZXh0cMOlbWluc2VydmVy"  # Replace with your actual secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize FastAPI
app = FastAPI()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# MongoDB connection
client = pymongo.MongoClient("mongodb://mongo:27017/")
db = client["skuggsnack"]
users_collection = db["users"]

# Pydantic models
class UserIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Message(BaseModel):
    message: str

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
        user_data = {"username": user.username, "hashed_password": hashed_password}
        users_collection.insert_one(user_data)
        return {"message": "User registered successfully"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.post("/auth/login", response_model=Token)
def login(user: UserIn):
    try:
        db_user = users_collection.find_one({"username": user.username})
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Check for both 'hashed_password' and 'password' keys
        hashed_password = db_user.get("hashed_password") or db_user.get("password")
        if not hashed_password:
            raise HTTPException(status_code=400, detail="Password not set for user.")
        
        if not verify_password(user.password, hashed_password):
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        token_data = {"sub": user.username}
        token = create_access_token(data=token_data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": token, "token_type": "bearer"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.get("/auth/me", response_model=UserOut)
def get_current_user(token: str = Depends(oauth2_scheme)):
    username = verify_token(token)
    return {"username": username}

# Health Check Endpoint
@app.get("/health")
def health_check():
    try:
        # Attempt a simple operation to verify database connectivity
        client.admin.command('ping')
        return {"status": "healthy"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Database connection failed.")
