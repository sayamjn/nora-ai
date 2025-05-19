const express = require('express');
const userRoutes = require('./api/users');
const interviewRoutes = require('./api/interviews');
const feedbackRoutes = require('./api/feedback');

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/interviews', interviewRoutes);
router.use('/api/feedback', feedbackRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Nora AI API' });
});

module.exports = router;