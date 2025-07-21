// api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Send message and get response
export const chatAPI = {
  async sendMessage(message: any, sessionId: any) {
    const response = await fetch(`${API_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        session_id: sessionId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response;
  },

  // Get conversation history
  async getHistory(sessionId: any) {
    const response = await fetch(`${API_URL}/chat/history/${sessionId}`)
    if (!response.ok) {
      throw new Error('Failed to get history');
    }
    return response.json()
  },

  // Create new conversation
  async newConversation() {
    const response = await fetch(`${API_URL}/chat/new`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error('Failed to create new conversation');
    }
    return response.json()
  }
};