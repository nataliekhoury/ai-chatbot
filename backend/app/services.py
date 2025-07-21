# services.py
from dotenv import load_dotenv
load_dotenv()
import firebase_admin
from firebase_admin import credentials, firestore
import openai
import os
import json
from datetime import datetime
from typing import List
from .models import Message, ConversationHistory

class FirebaseService:
    def __init__(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS_PATH'))
            firebase_admin.initialize_app(cred)
        self.db = firestore.client()

    async def get_conversation(self, session_id: str):
        try:
            doc = self.db.collection('conversations').document(session_id).get()
            if doc.exists:
                data = doc.to_dict()
                messages = [Message(**msg) for msg in data.get('messages', [])]
                return ConversationHistory(session_id=session_id, messages=messages)
            return ConversationHistory(session_id=session_id, messages=[])
        except Exception as e:
            print(f"Error getting conversation: {e}")
            return ConversationHistory(session_id=session_id, messages=[])

    async def save_message(self, session_id: str, message: Message):
        """Save single message to Firestore"""
        try:
            doc_ref = self.db.collection('conversations').document(session_id)
            doc = doc_ref.get()
            
            if doc.exists:
                doc_ref.update({
                    'messages': firestore.ArrayUnion([message.dict()]),
                    'updated_at': datetime.now()
                })
            else:
                doc_ref.set({
                    'session_id': session_id,
                    'messages': [message.dict()],
                    'created_at': datetime.now(),
                    'updated_at': datetime.now()
                })
        except Exception as e:
            print(f"Error saving message: {e}")

# OpenAI Service
class OpenAIService:
    def __init__(self):
        openai.api_key = os.getenv('OPENAI_API_KEY')

    async def stream_response(self, messages: List[Message], new_message: str):
        try:
            openai_messages = [
                {"role": "system", "content": "helpful AI chatbot."}
            ]
            
            #add conversation history
            for msg in messages:
                openai_messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
            
            #add new user message
            openai_messages.append({
                "role": "user", 
                "content": new_message
            })

            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=openai_messages,
                stream=True,
                store= True,

                
            )

            for chunk in response:
                if 'choices' in chunk:
                    delta = chunk['choices'][0].get('delta', {})
                    if 'content' in delta:
                        yield f"data: {json.dumps({'content': delta['content']})}\n\n"
            
            yield "data: [DONE]\n\n"
            
        except Exception as e:
            print(f"Error in OpenAI streaming: {e}")
            yield f"data: {json.dumps({'error': 'Failed to generate response'})}\n\n"


firebase_service = FirebaseService()
openai_service = OpenAIService()