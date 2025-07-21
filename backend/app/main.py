# main.py
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .models import ChatRequest, Message
from .services import firebase_service, openai_service
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv
load_dotenv()


app = FastAPI(title="Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat/stream")
async def stream_chat(request: ChatRequest):
    try:
        #get conversation history
        conversation = await firebase_service.get_conversation(request.session_id)
        
        #save user message
        user_message = Message(
            role="user",
            content=request.message,
            timestamp=datetime.now().isoformat()
        )
        await firebase_service.save_message(request.session_id, user_message)
        
        async def generate_stream():
            assistant_content = ""
            
            async for chunk in openai_service.stream_response(conversation.messages, request.message):
                yield chunk
                
                if chunk.startswith("data: ") and not chunk.endswith("[DONE]\n\n"):
                    try:
                        data = json.loads(chunk[6:])
                        if 'content' in data:
                            assistant_content += data['content']
                    except:
                        pass
            
            if assistant_content:
                ai_message = Message(
                    role="assistant",
                    content=assistant_content,
                    timestamp=datetime.now().isoformat()
                )
                await firebase_service.save_message(request.session_id, ai_message)
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/chat/history/{session_id}")
async def get_history(session_id: str):
    try:
        conversation = await firebase_service.get_conversation(session_id)
        return {
            "session_id": session_id,
            "messages": [msg.dict() for msg in conversation.messages]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat/new")
async def new_conversation():
    return {
        "session_id": str(uuid.uuid4()),
        "message": "New conversation created"
    }

@app.get("/")
async def root():
    return {"message": "Chatbot API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)