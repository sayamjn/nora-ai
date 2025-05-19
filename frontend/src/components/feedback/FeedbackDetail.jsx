import React from 'react';

/**
 * Component for displaying detailed feedback
 * @param {Object} props - Component props
 * @param {Object} props.feedback - Feedback data
 */
const FeedbackDetail = ({ feedback }) => {
  if (!feedback) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Loading feedback...</p>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Interview Feedback
        </h2>
        <p className="text-sm text-gray-500">
          Generated on {formatDate(feedback.generatedAt)}
        </p>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-800 mr-2">
            Job Fit Score:
          </h3>
          <div 
            className={`text-2xl font-bold
              ${feedback.fitScore >= 80 ? 'text-green-600' : ''}
              ${feedback.fitScore >= 60 && feedback.fitScore < 80 ? 'text-yellow-600' : ''}
              ${feedback.fitScore < 60 ? 'text-red-600' : ''}
            `}
          >
            {feedback.fitScore}%
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Overall Assessment
        </h3>
        <div className="text-gray-700 whitespace-pre-line">
          {feedback.overallAssessment}
        </div>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Strengths
            </h3>
            <ul className="space-y-2">
              {feedback.strengthsAndWeaknesses?.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {feedback.strengthsAndWeaknesses?.weaknesses?.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Skill Assessments
        </h3>
        
        <div className="space-y-4">
          {feedback.skillAssessments?.map((skill, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">{skill.skill}</span>
                <span className="text-gray-600">{skill.rating}/5</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    skill.rating >= 4 ? 'bg-green-600' : 
                    skill.rating >= 3 ? 'bg-blue-600' :
                    skill.rating >= 2 ? 'bg-yellow-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${(skill.rating / 5) * 100}%` }}
                />
              </div>
              
              {skill.comments && (
                <p className="text-sm text-gray-600 mt-1">{skill.comments}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Recommendations
        </h3>
        <ul className="space-y-2">
          {feedback.recommendations?.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">→</span>
              <span>{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackDetail;