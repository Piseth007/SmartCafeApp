from fastapi import FastAPI
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

app = FastAPI(title="AI Chat Service")

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["ai_chat_db"]
collection = db["chats"]

# Request model
class ChatRequest(BaseModel):
    user_id: str
    message: str

# Response model
class ChatResponse(BaseModel):
    reply: str
    timestamp: datetime

@app.get("/")
async def root():
    return {"status": "AI Service is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    # (Temporary AI logic – later replace with LLM)
    ai_reply = f"You said: {req.message}"

    chat_data = {
        "user_id": req.user_id,
        "user_message": req.message,
        "ai_reply": ai_reply,
        "timestamp": datetime.utcnow()
    }

    await collection.insert_one(chat_data)

    return {
        "reply": ai_reply,
        "timestamp": chat_data["timestamp"]
    }
