import api from './api';

/**
 * Upload files and create interview
 * @param {Object} formData - Form data with files and job title
 * @returns {Promise<Object>} - Created interview data
 */
export const createInterview = async (formData) => {
  const response = await api.post('/interviews', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

/**
 * Get all interviews for current user
 * @returns {Promise<Object>} - List of interviews
 */
export const getInterviews = async () => {
  const response = await api.get('/interviews');
  return response.data;
};

/**
 * Get interview by ID
 * @param {string} id - Interview ID
 * @returns {Promise<Object>} - Interview data
 */
export const getInterview = async (id) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
};

/**
 * Start an interview
 * @param {string} id - Interview ID
 * @returns {Promise<Object>} - Updated interview with first question
 */
export const startInterview = async (id) => {
  const response = await api.post(`/interviews/${id}/start`);
  return response.data;
};

/**
 * Submit answer and get next question
 * @param {string} id - Interview ID
 * @param {string} answer - User's answer
 * @returns {Promise<Object>} - Updated interview with next question
 */
export const submitAnswer = async (id, answer) => {
  const response = await api.post(`/interviews/${id}/answer`, { answer });
  return response.data;
};

/**
 * End an interview manually
 * @param {string} id - Interview ID
 * @returns {Promise<Object>} - Updated interview
 */
export const endInterview = async (id) => {
  const response = await api.post(`/interviews/${id}/end`);
  return response.data;
};

/**
 * Get transcript for an interview
 * @param {string} id - Interview ID
 * @returns {Promise<Object>} - Transcript data
 */
export const getTranscript = async (id) => {
  const response = await api.get(`/interviews/${id}/transcript`);
  return response.data;
};

/**
 * Get feedback for an interview
 * @param {string} interviewId - Interview ID
 * @returns {Promise<Object>} - Feedback data
 */
export const getFeedback = async (interviewId) => {
  const response = await api.get(`/feedback/${interviewId}`);
  return response.data;
};

/**
 * Generate feedback for an interview
 * @param {string} interviewId - Interview ID
 * @returns {Promise<Object>} - Generated feedback
 */
export const generateFeedback = async (interviewId) => {
  const response = await api.post(`/feedback/${interviewId}`);
  return response.data;
};

/**
 * Get all feedbacks for current user
 * @returns {Promise<Object>} - List of feedbacks
 */
export const getAllFeedbacks = async () => {
  const response = await api.get('/feedback');
  return response.data;
};