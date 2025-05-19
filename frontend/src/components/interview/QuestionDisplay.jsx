import React from 'react';

/**
 * Component to display the current interview question
 * @param {Object} props - Component props
 * @param {string} props.question - Current question text
 */
const QuestionDisplay = ({ question }) => {
  return (
    <div className="p-4 bg-blue-50 border-t border-blue-200">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-1">
          <svg 
            className="h-5 w-5 text-blue-600" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-blue-800">Current Question</h3>
          <p className="mt-1 text-base text-blue-900">{question}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;