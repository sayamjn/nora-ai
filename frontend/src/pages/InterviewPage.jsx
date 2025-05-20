import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatInterface from '../components/interview/ChatInterface';
import InterviewInitiator from '../components/interview/InterviewInitiator'; 
import Button from '../components/common/Button';
import { FullPageLoader } from '../components/common/Loader';
import useInterview from '../hooks/useInterview';

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentInterview,
    transcript,
    currentQuestion,
    isInterviewActive,
    isInterviewComplete,
    loading: contextLoading,
    error: contextError,
    startInterview,
    submitAnswer,
    endInterview,
    resetInterview,
    fetchInterview,
    fetchTranscript,
    loading,
    error,
    interviewData
  } = useInterview();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [localTranscript, setLocalTranscript] = useState([]);

    if (id === "new") {
    return <InterviewInitiator />;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      
      try {
        if (id && id !== "new") {
          const interview = await fetchInterview(id);
          
          if (interview?.transcript) {
            const transcriptData = await fetchTranscript(id);
            
            if (transcriptData) {
              setLocalTranscript(transcriptData.messages || []);
            }
          }
        }
      } finally {
        setIsPageLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      resetInterview();
    };
  }, [id]);
  
const handleStartInterview = async () => {
  try {
    await startInterview(id);
    // Force reload to update UI
    window.location.reload();
  } catch (error) {
    console.error("Error starting interview:", error);
    alert("There was an error starting the interview. The system will use pre-defined questions instead.");
    
    // Refresh the page to show the chat interface
    window.location.reload();
  } finally {
  }
};
  
  const handleSubmitAnswer = async (answer) => {
    await submitAnswer(id, answer);
  };
  
  const handleEndInterview = async () => {
    await endInterview(id);
    navigate(`/feedback/${interviewData._id}`);
  };
  
  if (isPageLoading || loading) {
    return <FullPageLoader />;
  }
  
  if (error || contextError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
        <p>{error || contextError}</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  if (!interviewData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
        <p>Interview not found</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
const canStartInterview = interviewData && interviewData.status === 'pending';
  
const isActive = isInterviewActive || (interviewData && interviewData.status === 'in-progress');
  
const isComplete = isInterviewComplete || (interviewData && interviewData.status === 'completed');
  
  const displayTranscript = transcript.length > 0 ? transcript : localTranscript;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {interviewData.jobTitle} - Interview
        </h1>
        <p className="text-gray-500">
          {isComplete 
            ? 'This interview has been completed.' 
            : isActive 
              ? 'Interview in progress. Answer the questions as you would in a real interview.'
              : 'Ready to start your interview. Click the button below to begin.'}
        </p>
      </div>
      
      {canStartInterview && !isActive && !isComplete && (
        <div className="mb-6">
          <Button 
            variant="primary" 
            onClick={handleStartInterview}
            isLoading={contextLoading}
          >
            Start Interview
          </Button>
        </div>
      )}
      
      {(isActive || isComplete || displayTranscript.length > 0) && (
        <div className="h-[70vh]">
          <ChatInterface
            messages={displayTranscript}
            currentQuestion={currentQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            onEndInterview={handleEndInterview}
            isComplete={isComplete}
            isLoading={contextLoading}
          />
        </div>
      )}
      
      {isComplete && interviewData.feedback && (
        <div className="mt-6">
          <Button 
            variant="primary" 
            onClick={() => navigate(`/feedback/${interviewData.feedback}`)}
          >
            View Feedback
          </Button>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;