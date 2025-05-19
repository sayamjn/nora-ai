
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Card component for displaying feedback summary
 * @param {Object} props - Component props
 * @param {Object} props.feedback - Feedback data
 */
const FeedbackCard = ({ feedback }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {feedback.interview.jobTitle}
        </h3>
        <p className="text-sm text-gray-500">
          Generated on {formatDate(feedback.generatedAt)}
        </p>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="font-semibold text-gray-700">Fit Score:</div>
            <div className="ml-2 font-bold text-lg">
              <span className={`
                ${feedback.fitScore >= 80 ? 'text-green-600' : ''}
                ${feedback.fitScore >= 60 && feedback.fitScore < 80 ? 'text-yellow-600' : ''}
                ${feedback.fitScore < 60 ? 'text-red-600' : ''}
              `}>
                {feedback.fitScore}%
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white
              ${feedback.fitScore >= 80 ? 'bg-green-600' : ''}
              ${feedback.fitScore >= 60 && feedback.fitScore < 80 ? 'bg-yellow-600' : ''}
              ${feedback.fitScore < 60 ? 'bg-red-600' : ''}
            ">
              {Math.round(feedback.fitScore / 10)}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 line-clamp-3">
            {feedback.overallAssessment.substring(0, 150)}...
          </p>
        </div>
        
        {feedback.strengthsAndWeaknesses && feedback.strengthsAndWeaknesses.strengths && (
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-700">Top Strengths:</span>
            <ul className="mt-1">
              {feedback.strengthsAndWeaknesses.strengths.slice(0, 2).map((strength, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-1">✓</span>
                  <span className="line-clamp-1">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <Link 
          to={`/feedback/${feedback._id}`} 
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Full Feedback
        </Link>
      </div>
    </div>
  );
};

export default FeedbackCard;