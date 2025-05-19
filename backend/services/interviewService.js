const Interview = require('../models/Interview');
const Transcript = require('../models/Transcript');
const Feedback = require('../models/Feedback');
const aiService = require('./aiService');
const logger = require('../utils/logger');


class InterviewService {
  /**
   * Start a new interview
   * @param {Object} interview - The interview object
   * @returns {Promise<Object>} - Updated interview with transcript
   */
  async startInterview(interview) {
    try {
      const transcript = new Transcript({
        interview: interview._id,
        messages: [],
        isComplete: false
      });
      
      await transcript.save();
      
      interview.transcript = transcript._id;
      interview.status = 'in-progress';
      interview.startTime = new Date();
      interview.currentQuestionIndex = 0;
      
      await interview.save();
      
      const firstQuestion = await aiService.generateNextQuestion(interview, []);
      
      transcript.messages.push({
        role: 'assistant',
        content: firstQuestion,
        timestamp: new Date()
      });
      
      await transcript.save();
      
      return {
        interview: await Interview.findById(interview._id),
        transcript,
        currentQuestion: firstQuestion
      };
    } catch (error) {
      logger.error(`Error starting interview: ${error.message}`);
      throw new Error('Failed to start interview');
    }
  }
  
  /**
   * Submit user answer and get next question
   * @param {string} interviewId - The interview ID
   * @param {string} userAnswer - The user's answer
   * @returns {Promise<Object>} - Updated interview data with next question
   */
  async submitAnswer(interviewId, userAnswer) {
    try {
      const interview = await Interview.findById(interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }
      
      if (interview.status !== 'in-progress') {
        throw new Error('Interview is not in progress');
      }
      
      const transcript = await Transcript.findById(interview.transcript);
      
      if (!transcript) {
        throw new Error('Transcript not found');
      }
      
      transcript.messages.push({
        role: 'user',
        content: userAnswer,
        timestamp: new Date()
      });
      
      await transcript.save();
      
      const isLastQuestion = interview.currentQuestionIndex >= interview.questionsCount - 1;
      
      if (isLastQuestion) {
        interview.status = 'completed';
        interview.endTime = new Date();
        await interview.save();
        
        transcript.isComplete = true;
        await transcript.save();
        
        this.generateFeedback(interview._id).catch(err => {
          logger.error(`Error generating feedback: ${err.message}`);
        });
        
        return {
          interview: await Interview.findById(interview._id),
          transcript: await Transcript.findById(transcript._id),
          currentQuestion: null,
          isComplete: true
        };
      }
      
      const previousMessages = transcript.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const nextQuestion = await aiService.generateNextQuestion(interview, previousMessages);
      
      transcript.messages.push({
        role: 'assistant',
        content: nextQuestion,
        timestamp: new Date()
      });
      
      await transcript.save();
      
      interview.currentQuestionIndex += 1;
      await interview.save();
      
      return {
        interview: await Interview.findById(interview._id),
        transcript: await Transcript.findById(transcript._id),
        currentQuestion: nextQuestion,
        isComplete: false
      };
    } catch (error) {
      logger.error(`Error submitting answer: ${error.message}`);
      throw new Error('Failed to submit answer and generate next question');
    }
  }
  
  /**
   * Generate feedback for a completed interview
   * @param {string} interviewId - The interview ID
   * @returns {Promise<Object>} - The generated feedback
   */
  async generateFeedback(interviewId) {
    try {
      const interview = await Interview.findById(interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }
      
      const transcript = await Transcript.findById(interview.transcript);
      
      if (!transcript) {
        throw new Error('Transcript not found');
      }
      
      if (interview.feedback) {
        const existingFeedback = await Feedback.findById(interview.feedback);
        if (existingFeedback) {
          return existingFeedback;
        }
      }
      
      const feedbackData = await aiService.generateFeedback(interview, transcript);
      
      const feedback = new Feedback({
        interview: interview._id,
        ...feedbackData,
        generatedAt: new Date()
      });
      
      await feedback.save();
      
      interview.feedback = feedback._id;
      await interview.save();
      
      return feedback;
    } catch (error) {
      logger.error(`Error generating feedback: ${error.message}`);
      throw new Error('Failed to generate interview feedback');
    }
  }
  
  /**
   * End an interview manually
   * @param {string} interviewId - The interview ID
   * @returns {Promise<Object>} - The updated interview
   */
  async endInterview(interviewId) {
    try {
      const interview = await Interview.findById(interviewId);
      
      if (!interview) {
        throw new Error('Interview not found');
      }
      
      if (interview.status !== 'in-progress') {
        throw new Error('Interview is not in progress');
      }
      
      const transcript = await Transcript.findById(interview.transcript);
      
      if (!transcript) {
        throw new Error('Transcript not found');
      }
      
      interview.status = 'completed';
      interview.endTime = new Date();
      await interview.save();
      
      transcript.isComplete = true;
      await transcript.save();
      
      this.generateFeedback(interview._id).catch(err => {
        logger.error(`Error generating feedback: ${err.message}`);
      });
      
      return await Interview.findById(interview._id);
    } catch (error) {
      logger.error(`Error ending interview: ${error.message}`);
      throw new Error('Failed to end interview');
    }
  }
}

module.exports = new InterviewService();