const Feedback = require('../models/Feedback');
const Interview = require('../models/Interview');
const interviewService = require('../services/interviewService');
const logger = require('../utils/logger');

/**
 * Get feedback for an interview
 * @route GET /api/feedback/:interviewId
 * @access Private
 */
const getFeedback = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this feedback'
      });
    }
    
    if (!interview.feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not yet generated'
      });
    }
    
    const feedback = await Feedback.findById(interview.feedback);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate feedback for an interview
 * @route POST /api/feedback/:interviewId
 * @access Private
 */
const generateFeedback = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate feedback for this interview'
      });
    }
    
    if (interview.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot generate feedback for an incomplete interview'
      });
    }
    
    const feedback = await interviewService.generateFeedback(interview._id);
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all feedbacks for a user
 * @route GET /api/feedback
 * @access Private
 */
const getAllFeedbacks = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ 
      user: req.user._id,
      feedback: { $exists: true, $ne: null }
    });
    
    const feedbackIds = interviews
      .filter(interview => interview.feedback)
      .map(interview => interview.feedback);
    
    const feedbacks = await Feedback.find({
      _id: { $in: feedbackIds }
    }).populate({
      path: 'interview',
      select: 'jobTitle createdAt'
    });
    
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeedback,
  generateFeedback,
  getAllFeedbacks
};