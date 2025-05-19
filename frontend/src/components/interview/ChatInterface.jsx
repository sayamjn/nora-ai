import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import QuestionDisplay from './QuestionDisplay';
import Button from '../common/Button';
import Loader from '../common/Loader';

/**
 * Chat interface component for interview
 * @param {Object} props - Component props
 * @param {Array} props.messages - Chat messages
 * @param {string} props.currentQuestion - Current question
 * @param {Function} props.onSubmitAnswer - Submit answer handler
 * @param {Function} props.onEndInterview - End interview handler
 * @param {boolean} props.isComplete - Is interview complete
 * @param {boolean} props.isLoading - Loading state
 */
const ChatInterface = ({
  messages,
  currentQuestion,
  onSubmitAnswer,
  onEndInterview,
  isComplete = false,
  isLoading = false
}) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmitAnswer(answer);
      setAnswer('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEndInterview = () => {
    const confirmed = window.confirm(
      'Are you sure you want to end the interview? This action cannot be undone.'
    );
    
    if (confirmed) {
      onEndInterview();
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <h2 className="text-lg font-medium text-gray-800">AI Interview</h2>
        <p className="text-sm text-gray-500">
          Answer questions as you would in a real interview
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length > 0 ? (
          <>
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              {isLoading ? (
                <Loader />
              ) : (
                'The interview will begin shortly...'
              )}
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {currentQuestion && !isComplete && (
        <QuestionDisplay question={currentQuestion} />
      )}
      
      <div className="p-4 border-t border-gray-200">
        {isComplete ? (
          <div className="text-center py-4">
            <p className="text-lg font-medium text-green-600 mb-2">
              Interview Complete
            </p>
            <p className="text-gray-600 mb-4">
              Thank you for completing the interview. Your feedback will be generated shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-start space-x-3">
              <div className="flex-1">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  disabled={isSubmitting || isLoading}
                ></textarea>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={!answer.trim() || isSubmitting || isLoading}
                >
                  Send
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleEndInterview}
                  disabled={isSubmitting || isLoading}
                >
                  End
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;