from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import pymongo
from pymongo.errors import ConnectionFailure
from datetime import datetime
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer

# Configuration
SECRET_KEY = "your_secret_key"  # Should match the auth-service secret
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
    recipient: str  # Either a user, group, or channel name
    content: str
    timestamp: datetime = datetime.utcnow()
    recipient_type: str  # Either "user", "group", or "channel"

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

# API Endpoints
@app.post("/send_message", response_model=MessageResponse)
def send_message(message: Message, token: str = Depends(oauth2_scheme)):
    sender = verify_token(token)
    if sender != message.sender:
        raise HTTPException(status_code=403, detail="Sender mismatch")
    try:
        # Save message to MongoDB
        message_dict = message.dict()
        messages_collection.insert_one(message_dict)
        return message_dict
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.get("/get_messages/{recipient}", response_model=List[MessageResponse])
def get_messages(recipient: str, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        # Retrieve messages for recipient
        messages = list(messages_collection.find({"recipient": recipient}))
        for message in messages:
            message["_id"] = str(message["_id"])  # Convert ObjectId to string for JSON serialization
        return messages
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.post("/create_channel", response_model=Dict[str, str])
def create_channel(channel: Channel, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        # Save channel to MongoDB
        db["channels"].insert_one(channel.dict())
        return {"message": "Channel created successfully"}
    except ConnectionFailure:
        raise HTTPException(status_code=500, detail="Failed to connect to the database.")

@app.post("/create_group", response_model=Dict[str, str])
def create_group(group: Group, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    try:
        # Save group to MongoDB
        db["groups"].insert_one(group.dict())
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
