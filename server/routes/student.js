const express = require('express');
const protect = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { getDashboardStats, getProfile, updateProfile } = require('../controllers/studentController');

const router = express.Router();

router.use(protect, requireRole('student'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
