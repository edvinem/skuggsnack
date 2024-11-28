from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict
import pymongo
from pymongo.errors import ConnectionFailure
from datetime import datetime, timezone
from jose import JWTError, jwt
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer
import os
import logging

SECRET_KEY = "amFnaGFyZW5qw6R2bGFtYXNzYW55Y2tsYXJpY2xlYXJ0ZXh0cMOlbWluc2VydmVy"
ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

try:
    client = pymongo.MongoClient(os.environ.get("MONGO_URI"))
    db = client["skuggsnack"]
    messages_collection = db["messages"]
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    raise HTTPException(status_code=500, detail="Database connection failed.")

class Message(BaseModel):
    sender: str
    recipient: str
    content: str
    recipient_type: str 
    timestamp: datetime = datetime.now(timezone.utc)

class MessageResponse(BaseModel):
    sender: str
    recipient: str
    content: str
    timestamp: datetime
    recipient_type: str

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    recipient: str
    content: str
    recipient_type: str

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/get_messages/{recipient}", response_model=List[MessageResponse])
def get_messages(recipient: str, token: str = Depends(oauth2_scheme)):
    sender = verify_token(token)
    messages = list(messages_collection.find({
        "$or": [
            {"sender": sender, "recipient": recipient, "recipient_type": "user"},
            {"sender": recipient, "recipient": sender, "recipient_type": "user"}
        ]
    }))
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return messages


@app.post("/send_message", response_model=MessageResponse)
def send_message(message: MessageCreate, token: str = Depends(oauth2_scheme)):
    try:
        username = verify_token(token)
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")

        message_data = {
            "sender": username,
            "recipient": message.recipient,
            "content": message.content,
            "recipient_type": message.recipient_type,
            "timestamp": datetime.now(timezone.utc)
        }
        messages_collection.insert_one(message_data)
        return MessageResponse(**message_data)
    except Exception as e:
        logger.error(f"Error in send_message: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
