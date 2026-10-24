const express = require('express');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');
const upload = require('../middleware/upload');
const { aiLimiter } = require('../middleware/rateLimiter');
const { analyzeResumeHandler, getResumeHistory, getResumeById } = require('../controllers/resumeController');

const router = express.Router();

router.use(protect, requireRole('student'));

router.post('/analyze', aiLimiter, upload.single('resume'), analyzeResumeHandler);
router.get('/history', getResumeHistory);
router.get('/history/:id', getResumeById);

module.exports = router;
