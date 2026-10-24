const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const ActivityLog = require('../models/ActivityLog');
const { asyncHandler } = require('../middleware/error');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const setCookieToken = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @route POST /api/auth/register
// @access Public
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password, role: 'student' });
  await StudentProfile.create({ user: user._id });

  const token = generateToken(user._id);
  setCookieToken(res, token);

  await ActivityLog.create({
    user: user._id,
    type: 'login',
    description: 'Account created and logged in',
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated' });
  }

  // Update streak
  if (user.role === 'student') {
    const profile = await StudentProfile.findOne({ user: user._id });
    if (profile) {
      const today = new Date();
      const last = profile.lastActiveDate ? new Date(profile.lastActiveDate) : null;
      const diffDays = last
        ? Math.floor((today - last) / (1000 * 60 * 60 * 24))
        : null;

      if (diffDays === 1) {
        profile.streak += 1;
      } else if (diffDays > 1 || diffDays === null) {
        profile.streak = 1;
      }
      profile.lastActiveDate = today;
      await profile.save();
    }
  }

  const token = generateToken(user._id);
  setCookieToken(res, token);

  await ActivityLog.create({
    user: user._id,
    type: 'login',
    description: 'Logged in',
  });

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

// @route POST /api/auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @route GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, logout, getMe };
