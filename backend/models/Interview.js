const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    jobDescriptionFile: {
      filename: String,
      originalName: String,
      mimetype: String,
      path: String,
    },
    resumeFile: {
      filename: String,
      originalName: String,
      mimetype: String,
      path: String,
    },
    resumeText: {
      type: String,
      required: [true, 'Resume text is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed'],
      default: 'pending',
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    transcript: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transcript',
    },
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    },
    questionsCount: {
      type: Number,
      default: 5,
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', InterviewSchema);