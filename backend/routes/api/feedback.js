const express = require('express');
const {
  getFeedback,
  generateFeedback,
  getAllFeedbacks
} = require('../../controllers/feedbackController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getAllFeedbacks);
router.route('/:interviewId')
  .get(getFeedback)
  .post(generateFeedback);

module.exports = router;