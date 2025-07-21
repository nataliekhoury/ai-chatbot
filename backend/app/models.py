from pydantic import BaseModel
from typing import List
from datetime import datetime

class Message(BaseModel):
    role: str  #user or assistant
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ConversationHistory(BaseModel):
    session_id: str
    messages: List[Message]