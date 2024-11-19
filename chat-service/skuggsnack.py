from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import pymongo
from pymongo.errors import ConnectionFailure
from datetime import datetime, timezone
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

# Configuration
SECRET_KEY = "amFnaGFyZW5qw6R2bGFtYXNzYW55Y2tsYXJpY2xlYXJ0ZXh0cMOlbWluc2VydmVy"
ALGORITHM = "HS256"

# FastAPI initialization
app = FastAPI()

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# MongoDB connection
client = pymongo.MongoClient("mongodb://mongo:27017/")
db = client["skuggsnack"]
messages_collection = db["messages"]

# Pydantic models
class Message(BaseModel):
    sender: str
    recipient: str
    content: str
    recipient_type: str  # 'user' or 'channel'
    timestamp: datetime = None

class MessageResponse(BaseModel):
    sender: str
    recipient: str
    content: str
    timestamp: datetime
    recipient_type: str

class Channel(BaseModel):
    name: str
    is_public: bool = True

class Group(BaseModel):
    name: str
    members: List[str]

class ConversationResponse(BaseModel):
    participant: str
    last_message: str
    timestamp: datetime

# Utility functions
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.get("/get_messages/{recipient}")
def get_messages(recipient: str):
    messages = list(messages_collection.find({"recipient": recipient}))
    for msg in messages:
        msg["_id"] = str(msg["_id"])  # Convert ObjectId to string
    return messages

@app.post("/send_message")
def send_message(message: Message):
    message.timestamp = datetime.utcnow()
    messages_collection.insert_one(message.dict())
    return {"message": "Message sent"}

@app.post("/create_channel", response_model=Dict[str, str])
def create_channel(channel: Channel, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        # Save channel to MongoDB
        db["channels"].insert_one(channel.model_dump())
        return {"message": "Channel created successfully"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.post("/create_group", response_model=Dict[str, str])
def create_group(group: Group, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        # Save group to MongoDB
        db["groups"].insert_one(group.model_dump())
        return {"message": "Group created successfully"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.get("/get_channel_messages/{channel_name}", response_model=List[MessageResponse])
def get_channel_messages(channel_name: str, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        messages = list(messages_collection.find({"recipient": channel_name, "recipient_type": "channel"}))
        for message in messages:
            message["_id"] = str(message["_id"])  # Convert ObjectId to string for JSON serialization
        return messages
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.get("/get_group_messages/{group_name}", response_model=List[MessageResponse])
def get_group_messages(group_name: str, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        messages = list(messages_collection.find({"recipient": group_name, "recipient_type": "group"}))
        for message in messages:
            message["_id"] = str(message["_id"])  # Convert ObjectId to string for JSON serialization
        return messages
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
