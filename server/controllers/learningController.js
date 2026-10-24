const Topic = require('../models/Topic');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');
const StudentProfile = require('../models/StudentProfile');
const ActivityLog = require('../models/ActivityLog');
const { tutorChat } = require('../services/aiService');
const { asyncHandler } = require('../middleware/error');

// @route GET /api/learning/topics
// @access Private
const getTopics = asyncHandler(async (req, res) => {
  const { track } = req.query;
  const query = track ? { track } : {};
  const topics = await Topic.find(query).sort('order');

  // Attach progress for each topic
  const topicsWithProgress = await Promise.all(
    topics.map(async (topic) => {
      const lessons = await Lesson.find({ topic: topic._id }).select('_id');
      const completed = await Progress.countDocuments({
        user: req.user._id,
        lesson: { $in: lessons.map((l) => l._id) },
        completed: true,
      });
      return {
        ...topic.toObject(),
        lessonCount: lessons.length,
        completedCount: completed,
        progressPercent: lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0,
      };
    })
  );

  res.json({ success: true, data: topicsWithProgress });
});

// @route GET /api/learning/lessons/:topicId
// @access Private
const getLessonsByTopic = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ topic: req.params.topicId }).sort('order').select('-content');
  const progressList = await Progress.find({
    user: req.user._id,
    lesson: { $in: lessons.map((l) => l._id) },
  });

  const lessonsWithProgress = lessons.map((lesson) => {
    const prog = progressList.find((p) => p.lesson.toString() === lesson._id.toString());
    return { ...lesson.toObject(), completed: prog?.completed || false };
  });

  res.json({ success: true, data: lessonsWithProgress });
});

// @route GET /api/learning/lesson/:id
// @access Private
const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate('topic', 'title track');
  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }
  const progress = await Progress.findOne({ user: req.user._id, lesson: lesson._id });
  const quiz = await Quiz.findOne({ lesson: lesson._id }).select('-questions.correctIndex -questions.explanation');

  res.json({
    success: true,
    data: { lesson, completed: progress?.completed || false, hasQuiz: !!quiz, quizId: quiz?._id },
  });
});

// @route POST /api/learning/complete-lesson
// @access Private
const completeLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ success: false, message: 'lessonId is required' });
  }

  const lesson = await Lesson.findById(lessonId).populate('topic');
  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  const existing = await Progress.findOne({ user: req.user._id, lesson: lessonId });
  if (existing && existing.completed) {
    return res.json({ success: true, message: 'Already completed', data: existing });
  }

  // Calculate topic progress
  const topicLessons = await Lesson.find({ topic: lesson.topic._id });
  const completedInTopic = await Progress.countDocuments({
    user: req.user._id,
    lesson: { $in: topicLessons.map((l) => l._id) },
    completed: true,
  });
  const topicProgressPercent = Math.round(
    ((completedInTopic + 1) / topicLessons.length) * 100
  );

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, lesson: lessonId },
    { completed: true, completedAt: new Date(), topicProgressPercent },
    { upsert: true, new: true }
  );

  // Update DSA skill score
  const allDsaLessons = await Lesson.find({
    topic: { $in: await Topic.find({ track: 'dsa' }).select('_id') },
  });
  const allCompleted = await Progress.countDocuments({
    user: req.user._id,
    lesson: { $in: allDsaLessons.map((l) => l._id) },
    completed: true,
  });
  const dsaScore = allDsaLessons.length > 0
    ? Math.round((allCompleted / allDsaLessons.length) * 100)
    : 0;
  await StudentProfile.findOneAndUpdate({ user: req.user._id }, { 'skillScores.dsa': dsaScore });

  await ActivityLog.create({
    user: req.user._id,
    type: 'lesson_complete',
    description: `Completed lesson: ${lesson.title}`,
  });

  res.json({ success: true, data: progress });
});

// @route GET /api/learning/quiz/:id
// @access Private
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('lesson', 'title');
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }
  // Don't send correctIndex to client
  const sanitized = {
    ...quiz.toObject(),
    questions: quiz.questions.map(({ question, options, _id }) => ({ question, options, _id })),
  };
  res.json({ success: true, data: sanitized });
});

// @route POST /api/learning/quiz/:id/submit
// @access Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body; // array of { questionIndex, selectedIndex }
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }

  let correct = 0;
  const gradedAnswers = answers.map((ans) => {
    const q = quiz.questions[ans.questionIndex];
    const isCorrect = q && q.correctIndex === ans.selectedIndex;
    if (isCorrect) correct++;
    return {
      questionIndex: ans.questionIndex,
      selectedIndex: ans.selectedIndex,
      isCorrect,
      correctIndex: q?.correctIndex,
      explanation: q?.explanation,
    };
  });

  const score = Math.round((correct / quiz.questions.length) * 100);

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    score,
    answers: gradedAnswers.map(({ questionIndex, selectedIndex, isCorrect }) => ({
      questionIndex, selectedIndex, isCorrect,
    })),
  });

  await ActivityLog.create({
    user: req.user._id,
    type: 'quiz_attempt',
    description: `Quiz completed – Score: ${score}%`,
  });

  res.json({ success: true, data: { score, correct, total: quiz.questions.length, gradedAnswers } });
});

// @route POST /api/learning/tutor-chat
// @access Private
const tutorChatHandler = asyncHandler(async (req, res) => {
  const { concept, question, history } = req.body;
  if (!question) {
    return res.status(400).json({ success: false, message: 'Question is required' });
  }
  const response = await tutorChat(concept || 'General CS concepts', question, history || []);
  res.json({ success: true, data: { response } });
});

module.exports = {
  getTopics,
  getLessonsByTopic,
  getLessonById,
  completeLesson,
  getQuiz,
  submitQuiz,
  tutorChatHandler,
};
