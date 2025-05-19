const mongoose = require('mongoose');

const SkillAssessmentSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comments: String,
  },
  { _id: true }
);

const FeedbackSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
    },
    overallAssessment: {
      type: String,
      required: true,
    },
    strengthsAndWeaknesses: {
      strengths: [String],
      weaknesses: [String],
    },
    skillAssessments: [SkillAssessmentSchema],
    fitScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    recommendations: [String],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', FeedbackSchema);