import React from 'react';

/**
 * Chat bubble component for interview messages
 * @param {Object} props - Component props
 * @param {string} props.role - Message role (user or assistant)
 * @param {string} props.content - Message content
 * @param {string} props.timestamp - Message timestamp
 */
const ChatBubble = ({ 
  role = 'assistant', 
  content, 
  timestamp 
}) => {
  const isUser = role === 'user';
  
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : '';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`
          max-w-3xl rounded-lg px-4 py-3 
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-800'}
        `}
      >
        <div className="text-sm">
          {content}
        </div>
        
        <div 
          className={`
            text-xs mt-1 text-right 
            ${isUser ? 'text-blue-200' : 'text-gray-500'}
          `}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;