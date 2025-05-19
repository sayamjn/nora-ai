const express = require('express');
const {
  createInterview,
  getInterviews,
  getInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getTranscript
} = require('../../controllers/interviewController');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/fileUpload');

const router = express.Router();

router.use(protect);

const uploadFiles = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]);

router.route('/')
  .post(uploadFiles, createInterview)
  .get(getInterviews);

router.route('/:id')
  .get(getInterview);

router.post('/:id/start', startInterview);
router.post('/:id/answer', submitAnswer);
router.post('/:id/end', endInterview);
router.get('/:id/transcript', getTranscript);

module.exports = router;