# AI Chatbot 

A chatbot built with React, FastAPI, Firebase, and OpenAI.

# Backend server side : make sure you're in the backend directory
cd backend
# Install dependencies
pip install -r requirements.txt

# start the server by running this command
uvicorn app.main:app --reload --port 8000

Backend will start at http://localhost:8000


# Front end server side :make sure you're in the frontend directory by open a new terminal
cd frontend
# Install dependencies
npm install
# Start the frontend server by runningthis command
npm start

Frontend will start at http://localhost:3000

## API KEYS Handling
- Create a `.env` file in both the `frontend` and `backend` folders.
- Add the required API keys 
# In the `.env` file inside frontend folder add this and replace it with your firebase configuration :
 REACT_APP_FIREBASE_API_KEY=your_api_key_here
 REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
 REACT_APP_FIREBASE_PROJECT_ID=your-project-id
 REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
 REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
 REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef12345

# In the `.env` file inside backend folder add these and replace it with your keys :
-OPENAI_API_KEY=sk-proj-your-actual-key-here , you can create a new private API key from openai platform
-FIREBASE_CREDENTIALS_PATH=./serviceAccountKey.json , you can find the serviceAccountKey.json go to firebase console->project settings->service account-> generate new private key it will be a JSON file drage it to the backend folder and rename it serviceAccountKey 






