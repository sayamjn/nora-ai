import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewContext from '../context/InterviewContext';
import { createInterview, getInterview, getTranscript, getFeedback, generateFeedback } from '../services/interviewService';

const useInterview = () => {
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
    resetInterview
  } = useContext(InterviewContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  
  const navigate = useNavigate();

  /**
   * Create a new interview
   * @param {Object} formData - Form data with files and job title
   */
  const handleCreateInterview = async (formData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createInterview(formData);
      
      if (response.success) {
        navigate(`/interviews/${response.data._id}`);
        return response.data;
      } else {
        setError(response.message || 'Failed to create interview');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch interview data by ID
   * @param {string} id - Interview ID
   */
  const fetchInterview = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInterview(id);
      
      if (response.success) {
        setInterviewData(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch interview');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch transcript for an interview
   * @param {string} id - Interview ID
   */
  const fetchTranscript = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTranscript(id);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch transcript');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch feedback for an interview
   * @param {string} id - Interview ID
   */
  const fetchFeedback = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getFeedback(id);
      
      if (response.success) {
        setFeedback(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate feedback for an interview
   * @param {string} id - Interview ID
   */
  const handleGenerateFeedback = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await generateFeedback(id);
      
      if (response.success) {
        setFeedback(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to generate feedback');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentInterview,
    transcript,
    currentQuestion,
    isInterviewActive,
    isInterviewComplete,
    contextLoading,
    contextError,
    startInterview,
    submitAnswer,
    endInterview,
    resetInterview,
    
    loading,
    error,
    feedback,
    interviewData,
    
    handleCreateInterview,
    fetchInterview,
    fetchTranscript,
    fetchFeedback,
    handleGenerateFeedback
  };
};

export default useInterview;