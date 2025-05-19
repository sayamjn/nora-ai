import { createContext, useState, useCallback } from 'react';
import {
  startInterview as apiStartInterview,
  submitAnswer as apiSubmitAnswer,
  endInterview as apiEndInterview
} from '../services/interviewService';

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [currentInterview, setCurrentInterview] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startInterview = useCallback(async (interviewId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiStartInterview(interviewId);
      
      if (response.success) {
        const { interview, transcript, currentQuestion } = response.data;
        
        setCurrentInterview(interview);
        setTranscript(transcript.messages || []);
        setCurrentQuestion(currentQuestion);
        setIsInterviewActive(true);
        setIsInterviewComplete(false);
      } else {
        setError(response.message || 'Failed to start interview');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (interviewId, answer) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiSubmitAnswer(interviewId, answer);
      
      if (response.success) {
        const { interview, transcript, currentQuestion, isComplete } = response.data;
        
        setCurrentInterview(interview);
        setTranscript(transcript.messages || []);
        setCurrentQuestion(currentQuestion);
        setIsInterviewComplete(isComplete);
        
        if (isComplete) {
          setIsInterviewActive(false);
        }
      } else {
        setError(response.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const endInterview = useCallback(async (interviewId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiEndInterview(interviewId);
      
      if (response.success) {
        setCurrentInterview(response.data);
        setIsInterviewActive(false);
        setIsInterviewComplete(true);
      } else {
        setError(response.message || 'Failed to end interview');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetInterview = useCallback(() => {
    setCurrentInterview(null);
    setTranscript([]);
    setCurrentQuestion(null);
    setIsInterviewActive(false);
    setIsInterviewComplete(false);
    setError(null);
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        currentInterview,
        transcript,
        currentQuestion,
        isInterviewActive,
        isInterviewComplete,
        loading,
        error,
        startInterview,
        submitAnswer,
        endInterview,
        resetInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;