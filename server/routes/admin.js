const express = require('express');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');
const {
  getAdminStats, getStudents, getStudentById, toggleStudentStatus, getAnalytics,
  createTopic, updateTopic, deleteTopic,
  createLesson, updateLesson, deleteLesson,
  createQuiz, updateQuiz, deleteQuiz,
  getJobRoles, createJobRole, updateJobRole, deleteJobRole,
  exportCSV,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, requireRole('admin'));

// Overview
router.get('/stats', getAdminStats);
router.get('/analytics', getAnalytics);

// Student management
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.patch('/students/:id/toggle-status', toggleStudentStatus);

// Content management - Topics
router.post('/topics', createTopic);
router.put('/topics/:id', updateTopic);
router.delete('/topics/:id', deleteTopic);

// Content management - Lessons
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

// Content management - Quizzes
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

// Job roles
router.get('/roles', getJobRoles);
router.post('/roles', createJobRole);
router.put('/roles/:id', updateJobRole);
router.delete('/roles/:id', deleteJobRole);

// Export
router.get('/export-csv', exportCSV);

module.exports = router;
