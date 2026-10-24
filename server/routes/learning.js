const express = require('express');
const protect = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const {
  getTopics,
  getLessonsByTopic,
  getLessonById,
  completeLesson,
  getQuiz,
  submitQuiz,
  tutorChatHandler,
} = require('../controllers/learningController');

const router = express.Router();

router.use(protect);

router.get('/topics', getTopics);
router.get('/topics/:topicId/lessons', getLessonsByTopic);
router.get('/lesson/:id', getLessonById);
router.post('/complete-lesson', completeLesson);
router.get('/quiz/:id', getQuiz);
router.post('/quiz/:id/submit', submitQuiz);
router.post('/tutor-chat', aiLimiter, tutorChatHandler);

module.exports = router;
