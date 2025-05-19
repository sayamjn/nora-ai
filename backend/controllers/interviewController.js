const Interview = require('../models/Interview');
const Transcript = require('../models/Transcript');
const interviewService = require('../services/interviewService');
const documentProcessingService = require('../services/documentProcessingService');
const logger = require('../utils/logger');

/**
 * Create a new interview by uploading resume and job description
 * @route POST /api/interviews
 * @access Private
 */
const createInterview = async (req, res, next) => {
  try {
    const { jobTitle } = req.body;
    
    if (!jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required'
      });
    }
    
    if (!req.files || !req.files.resume || !req.files.jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume and job description files are required'
      });
    }
    
    const resumeText = await documentProcessingService.processDocument(req.files.resume[0]);
    const jobDescriptionText = await documentProcessingService.processDocument(req.files.jobDescription[0]);
    
    const interview = new Interview({
      user: req.user._id,
      jobTitle,
      jobDescription: jobDescriptionText,
      resumeText,
      jobDescriptionFile: {
        filename: req.files.jobDescription[0].filename,
        originalName: req.files.jobDescription[0].originalname,
        mimetype: req.files.jobDescription[0].mimetype,
        path: req.files.jobDescription[0].path
      },
      resumeFile: {
        filename: req.files.resume[0].filename,
        originalName: req.files.resume[0].originalname,
        mimetype: req.files.resume[0].mimetype,
        path: req.files.resume[0].path
      },
      status: 'pending'
    });
    
    await interview.save();
    
    req.user.interviews.push(interview._id);
    await req.user.save();
    
    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all interviews for the current user
 * @route GET /api/interviews
 * @access Private
 */
const getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single interview by ID
 * @route GET /api/interviews/:id
 * @access Private
 */
const getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('transcript')
      .populate('feedback');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }
    
    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start an interview
 * @route POST /api/interviews/:id/start
 * @access Private
 */
const startInterview = async (req, res, next) => {
  try {
    let interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }
    
    if (interview.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Interview is already ${interview.status}`
      });
    }
    
    const result = await interviewService.startInterview(interview);
    
    res.status(200).json({
      success: true,
      data: {
        interview: result.interview,
        transcript: result.transcript,
        currentQuestion: result.currentQuestion
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit answer and get next question
 * @route POST /api/interviews/:id/answer
 * @access Private
 */
const submitAnswer = async (req, res, next) => {
  try {
    const { answer } = req.body;
    
    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Answer is required'
      });
    }
    
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }
    
    if (interview.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in progress'
      });
    }
    
    const result = await interviewService.submitAnswer(req.params.id, answer);
    
    res.status(200).json({
      success: true,
      data: {
        interview: result.interview,
        transcript: result.transcript,
        currentQuestion: result.currentQuestion,
        isComplete: result.isComplete
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * End an interview
 * @route POST /api/interviews/:id/end
 * @access Private
 */
const endInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }
    
    if (interview.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Interview is not in progress'
      });
    }
    
    const updatedInterview = await interviewService.endInterview(req.params.id);
    
    res.status(200).json({
      success: true,
      data: updatedInterview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transcript for an interview
 * @route GET /api/interviews/:id/transcript
 * @access Private
 */
const getTranscript = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    if (interview.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this interview'
      });
    }
    
    const transcript = await Transcript.findById(interview.transcript);
    
    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: 'Transcript not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transcript
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getTranscript
};