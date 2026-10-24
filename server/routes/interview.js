const express = require('express');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  getResumeStatus,
  uploadResumeForInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getInterviewHistory,
  getInterviewById,
} = require('../controllers/interviewController');

const router = express.Router();

router.use(protect, requireRole('student'));

router.get('/resume-status', getResumeStatus);
router.post('/upload-resume', aiLimiter, upload.single('resume'), uploadResumeForInterview);
router.post('/start', aiLimiter, startInterview);
router.post('/submit-answer', aiLimiter, submitAnswer);
router.post('/end', endInterview);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterviewById);

module.exports = router;
