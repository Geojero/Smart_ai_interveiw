const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const JobRole = require('../models/JobRole');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Progress = require('../models/Progress');
const ActivityLog = require('../models/ActivityLog');
const { asyncHandler } = require('../middleware/error');
const { Parser } = require('json2csv');

// @route GET /api/admin/stats
const getAdminStats = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyActiveUsers = await ActivityLog.distinct('user', {
    timestamp: { $gte: sevenDaysAgo },
  }).then((users) => users.length);

  const profiles = await StudentProfile.find();
  const avgDSA =
    profiles.length > 0
      ? Math.round(profiles.reduce((sum, p) => sum + (p.skillScores.dsa || 0), 0) / profiles.length)
      : 0;

  const resumeCount = await ResumeAnalysis.countDocuments();
  const avgATS =
    resumeCount > 0
      ? Math.round(
          (await ResumeAnalysis.aggregate([{ $group: { _id: null, avg: { $avg: '$atsScore' } } }]))[0]?.avg || 0
        )
      : 0;

  // User growth - last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const userGrowth = await User.aggregate([
    { $match: { role: 'student', createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: { totalStudents, weeklyActiveUsers, avgDSA, resumeCount, avgATS, userGrowth },
  });
});

// @route GET /api/admin/students
const getStudents = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, isActive } = req.query;
  const query = { role: 'student' };
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const total = await User.countDocuments(query);
  const students = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, data: { students, total, page: Number(page), pages: Math.ceil(total / limit) } });
});

// @route GET /api/admin/students/:id
const getStudentById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user || user.role !== 'student') {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  const profile = await StudentProfile.findOne({ user: user._id });
  const recentActivity = await ActivityLog.find({ user: user._id }).sort({ timestamp: -1 }).limit(5);
  res.json({ success: true, data: { user, profile, recentActivity } });
});

// @route PATCH /api/admin/students/:id/toggle-status
const toggleStudentStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'student') {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: { isActive: user.isActive } });
});

// @route GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  // Most missing skills across resumes
  const missingSkillsAgg = await ResumeAnalysis.aggregate([
    { $unwind: '$missingSkills' },
    { $group: { _id: '$missingSkills', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Topic weakness (low completion topics)
  const topics = await Topic.find({ track: 'dsa' }).sort('order');
  const topicWeakness = await Promise.all(
    topics.map(async (topic) => {
      const lessons = await Lesson.find({ topic: topic._id }).select('_id');
      const totalPossible = await User.countDocuments({ role: 'student' }) * lessons.length;
      const completed = await Progress.countDocuments({
        lesson: { $in: lessons.map((l) => l._id) },
        completed: true,
      });
      return {
        topic: topic.title,
        completionRate: totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0,
      };
    })
  );

  res.json({ success: true, data: { missingSkills: missingSkillsAgg, topicWeakness } });
});

// Content CRUD — Topics
const createTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.create(req.body);
  res.status(201).json({ success: true, data: topic });
});

const updateTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
  res.json({ success: true, data: topic });
});

const deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findByIdAndDelete(req.params.id);
  if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
  res.json({ success: true, message: 'Topic deleted' });
});

// Content CRUD — Lessons
const createLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create(req.body);
  res.status(201).json({ success: true, data: lesson });
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
  res.json({ success: true, data: lesson });
});

const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
  res.json({ success: true, message: 'Lesson deleted' });
});

// Content CRUD — Quizzes
const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json({ success: true, data: quiz });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  res.json({ success: true, data: quiz });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  res.json({ success: true, message: 'Quiz deleted' });
});

// Content CRUD — Job Roles
const getJobRoles = asyncHandler(async (req, res) => {
  const roles = await JobRole.find().sort('title');
  res.json({ success: true, data: roles });
});

const createJobRole = asyncHandler(async (req, res) => {
  const role = await JobRole.create(req.body);
  res.status(201).json({ success: true, data: role });
});

const updateJobRole = asyncHandler(async (req, res) => {
  const role = await JobRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
  res.json({ success: true, data: role });
});

const deleteJobRole = asyncHandler(async (req, res) => {
  const role = await JobRole.findByIdAndDelete(req.params.id);
  if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
  res.json({ success: true, message: 'Job role deleted' });
});

// @route GET /api/admin/export-csv
const exportCSV = asyncHandler(async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password');
  const profiles = await StudentProfile.find();

  const data = students.map((s) => {
    const profile = profiles.find((p) => p.user.toString() === s._id.toString());
    return {
      name: s.name,
      email: s.email,
      isActive: s.isActive,
      targetRole: profile?.targetRole || '',
      college: profile?.college || '',
      streak: profile?.streak || 0,
      communication: profile?.skillScores?.communication || 0,
      dsa: profile?.skillScores?.dsa || 0,
      problemSolving: profile?.skillScores?.problemSolving || 0,
      coreCS: profile?.skillScores?.coreCS || 0,
      resume: profile?.skillScores?.resume || 0,
      aptitude: profile?.skillScores?.aptitude || 0,
      interviewsPracticed: profile?.interviewsPracticed || 0,
      createdAt: s.createdAt.toISOString().split('T')[0],
    };
  });

  const fields = Object.keys(data[0] || {});
  const parser = new Parser({ fields });
  const csv = parser.parse(data);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
  res.send(csv);
});

module.exports = {
  getAdminStats, getStudents, getStudentById, toggleStudentStatus, getAnalytics,
  createTopic, updateTopic, deleteTopic,
  createLesson, updateLesson, deleteLesson,
  createQuiz, updateQuiz, deleteQuiz,
  getJobRoles, createJobRole, updateJobRole, deleteJobRole,
  exportCSV,
};
