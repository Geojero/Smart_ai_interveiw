const StudentProfile = require('../models/StudentProfile');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');
const ActivityLog = require('../models/ActivityLog');
const MockInterview = require('../models/MockInterview');
const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');
const { asyncHandler } = require('../middleware/error');

// @route GET /api/student/dashboard-stats
// @access Private (student)
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  // DSA progress
  const dsaTopics = await Topic.find({ track: 'dsa' }).sort('order');
  const allLessons = await Lesson.find({
    topic: { $in: dsaTopics.map((t) => t._id) },
  });
  const completedProgress = await Progress.find({
    user: userId,
    completed: true,
    lesson: { $in: allLessons.map((l) => l._id) },
  });

  const dsaCompletion =
    allLessons.length > 0
      ? Math.round((completedProgress.length / allLessons.length) * 100)
      : 0;

  // Topic-wise progress
  const topicProgress = await Promise.all(
    dsaTopics.map(async (topic) => {
      const topicLessons = allLessons.filter(
        (l) => l.topic.toString() === topic._id.toString()
      );
      const completed = completedProgress.filter((p) =>
        topicLessons.some((l) => l._id.toString() === p.lesson.toString())
      );
      return {
        topic: topic.title,
        total: topicLessons.length,
        completed: completed.length,
        percent:
          topicLessons.length > 0
            ? Math.round((completed.length / topicLessons.length) * 100)
            : 0,
      };
    })
  );

  // Recent activity (last 10)
  const recentActivity = await ActivityLog.find({ user: userId })
    .sort({ timestamp: -1 })
    .limit(10);

  // Weekly activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const weeklyLogs = await ActivityLog.find({
    user: userId,
    timestamp: { $gte: sevenDaysAgo },
  }).sort({ timestamp: 1 });

  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = weeklyLogs.filter(
      (log) => log.timestamp.toISOString().split('T')[0] === dateStr
    ).length;
    weeklyActivity.push({ date: dateStr, count });
  }

  // Readiness score (average of all skills)
  const skills = profile.skillScores;
  const skillValues = [
    skills.communication,
    skills.dsa || dsaCompletion,
    skills.problemSolving,
    skills.coreCS,
    skills.resume,
    skills.aptitude,
  ];
  const overallReadiness = Math.round(
    skillValues.reduce((a, b) => a + b, 0) / skillValues.length
  );

  res.json({
    success: true,
    data: {
      profile: {
        targetRole: profile.targetRole,
        streak: profile.streak,
        interviewsPracticed: profile.interviewsPracticed,
      },
      overallReadiness,
      skillScores: {
        ...profile.skillScores,
        dsa: dsaCompletion,
      },
      dsaCompletion,
      topicProgress,
      recentActivity,
      weeklyActivity,
    },
  });
});

// @route GET /api/student/profile
// @access Private (student)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email createdAt');
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }
  res.json({ success: true, data: profile });
});

// @route PUT /api/student/profile
// @access Private (student)
const updateProfile = asyncHandler(async (req, res) => {
  const { targetRole, college, graduationYear } = req.body;
  const profile = await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    { targetRole, college, graduationYear },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: profile });
});

module.exports = { getDashboardStats, getProfile, updateProfile };
