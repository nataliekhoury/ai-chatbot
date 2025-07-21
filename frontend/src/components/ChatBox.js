// ChatBox.js 
import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { chatAPI } from '../services/api';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      const newSessionId = Date.now().toString();
      setSessionId(newSessionId);
      
      try {
        const history = await chatAPI.getHistory(newSessionId);
        setMessages(history.messages || []);
      } catch (error) {
        console.log('Starting new conversation');
      }
    };
    
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText) => {
    console.log('Sending message:', messageText);
    setIsLoading(true);

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
      // i could do the url in diffrent way (urlBase/chat/stream)
    try {
      const response = await fetch('http://localhost:8000/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const aiMessage = {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      };
      
      let currentMessages = [...messages, userMessage, aiMessage];
      setMessages(currentMessages);
      
      const aiMessageIndex = currentMessages.length - 1;
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream finished');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const data = line.trim().slice(6);
            
            if (data === '[DONE]') {
              console.log('Received DONE signal');
              setIsLoading(false);
              return;
            }

            if (!data.trim()) {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullResponse += parsed.content;
                
                setMessages(prevMessages => 
                  prevMessages.map((msg, index) => {
                    if (index === aiMessageIndex && msg.role === 'assistant') {
                      return { ...msg, content: fullResponse };
                    }
                    return msg;
                  })
                );
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              console.warn('Failed to parse data:', data, parseError);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: ' Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const result = await chatAPI.newConversation();
      setSessionId(result.session_id);
      setMessages([]);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'New conversation started!';
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Failed to start new conversation';
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Chatbot
              </h1>
              <p className="text-sm text-gray-600">
                {messages.length} message{messages.length !== 1 ? 's' : ''} • Session {sessionId.slice(-4)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
              isLoading 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
              }`} />
              <span>
                {isLoading ? 'AI Thinking...' : 'Ready'}
              </span>
            </div>

            <button
              onClick={startNewChat}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              title="Start new conversation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline font-medium">New Chat</span>
            </button>
          </div>
        </div>
      </div>

      <MessageList messages={messages} />
      <div ref={messagesEndRef} />

      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatBox;