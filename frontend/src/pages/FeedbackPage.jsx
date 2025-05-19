import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackDetail from '../components/feedback/FeedbackDetail';
import Button from '../components/common/Button';
import { FullPageLoader } from '../components/common/Loader';
import useInterview from '../hooks/useInterview';

const FeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    fetchFeedback,
    handleGenerateFeedback,
    feedback,
    loading,
    error
  } = useInterview();
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFeedback(id);
      } catch (err) {
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      await handleGenerateFeedback(id);
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (loading) {
    return <FullPageLoader />;
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h2>
        
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
        
        {error.includes('not yet generated') && (
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              The feedback for this interview has not been generated yet. Would you like to generate it now?
            </p>
            
            <Button
              variant="primary"
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={isGenerating}
            >
              Generate Feedback
            </Button>
          </div>
        )}
        
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
      
      <FeedbackDetail feedback={feedback} />
    </div>
  );
};

export default FeedbackPage;