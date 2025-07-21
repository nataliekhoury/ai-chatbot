// MessageInput.js
import React, { useState, useRef, useEffect } from 'react';

function MessageInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          
          <div className={`relative flex items-end space-x-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
            isFocused 
              ? 'border-blue-500 bg-blue-50/30 shadow-lg ring-4 ring-blue-500/10' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={isLoading ? "AI is responding..." : "Type your message... (Press Enter to send)"}
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 bg-transparent resize-none border-none outline-none text-gray-800 placeholder-gray-500 disabled:opacity-50"
                style={{ 
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
              />
              
              {message.length > 200 && (
                <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                  {message.length}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 ${
                message.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title={isLoading ? "AI is responding..." : "Send message"}
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 px-2">
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500">
                <span className="inline-flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">↵</kbd>
                  <span className="ml-1">to send</span>
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="inline-flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">Shift + ↵</kbd>
                  <span className="ml-1">new line</span>
                </span>
              </div>
            </div>

            <div className={`text-xs flex items-center space-x-2 ${
              isLoading ? 'text-blue-500' : 'text-green-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isLoading ? 'bg-blue-400 animate-pulse' : 'bg-green-400'
              }`} />
              <span>
                {isLoading ? 'AI is typing...' : 'Ready to chat'}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageInput;