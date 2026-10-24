const MockInterview = require('../models/MockInterview');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const StudentProfile = require('../models/StudentProfile');
const ActivityLog = require('../models/ActivityLog');
const JobRole = require('../models/JobRole');
const {
  generateResumeInterviewQuestions,
  evaluateAnswerWithCommunication,
  generateInterviewSummary,
} = require('../services/aiService');
const { extractTextFromFile, cleanupFile } = require('../services/resumeParser');
const { asyncHandler } = require('../middleware/error');

// @route GET /api/interview/resume-status
// @access Private (student)
const getResumeStatus = asyncHandler(async (req, res) => {
  const latestResume = await ResumeAnalysis.findOne({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('fileName targetRole atsScore matchedSkills missingSkills createdAt');

  res.json({
    success: true,
    hasResume: Boolean(latestResume),
    resume: latestResume || null,
  });
});

// @route POST /api/interview/upload-resume
// @access Private (student)
const uploadResumeForInterview = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a resume file' });
  }

  const targetRole = req.body.targetRole || 'Full Stack Developer';

  let extractedText = '';
  try {
    extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);
  } catch (err) {
    cleanupFile(req.file.path);
    return res.status(400).json({ success: false, message: 'Failed to extract text from file: ' + err.message });
  } finally {
    cleanupFile(req.file.path);
  }

  if (!extractedText || extractedText.trim().length < 50) {
    return res.status(400).json({ success: false, message: 'Uploaded resume appears to be empty or unreadable' });
  }

  // Create or update ResumeAnalysis record
  const saved = await ResumeAnalysis.create({
    user: req.user._id,
    targetRole,
    fileName: req.file.originalname,
    extractedText,
    atsScore: 75,
    matchedSkills: [],
    missingSkills: [],
  });

  res.status(201).json({
    success: true,
    message: 'Resume uploaded and processed successfully',
    data: {
      _id: saved._id,
      fileName: saved.fileName,
      targetRole: saved.targetRole,
      createdAt: saved.createdAt,
    },
  });
});

// @route POST /api/interview/start
// @access Private (student)
const startInterview = asyncHandler(async (req, res) => {
  const { role, type, difficulty = 'intermediate', duration = 5, resumeId } = req.body;

  if (!role || !type) {
    return res.status(400).json({ success: false, message: 'Role and interview type are required' });
  }

  const validTypes = ['technical', 'hr', 'mixed'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: `Type must be one of: ${validTypes.join(', ')}` });
  }

  const validDifficulties = ['beginner', 'intermediate', 'advanced'];
  const safeDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'intermediate';
  const questionCount = Math.max(1, Math.min(Number(duration) || 5, 10));

  // Determine resume source
  let resumeDoc = null;
  if (resumeId) {
    resumeDoc = await ResumeAnalysis.findOne({ _id: resumeId, user: req.user._id });
  }
  if (!resumeDoc) {
    resumeDoc = await ResumeAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  }

  const resumeText = resumeDoc ? resumeDoc.extractedText : null;
  const resumeFileName = resumeDoc ? resumeDoc.fileName : '';

  // Generate resume-tailored questions via Gemini
  const generatedQuestions = await generateResumeInterviewQuestions(
    resumeText,
    role,
    type,
    safeDifficulty,
    questionCount
  );

  const interview = await MockInterview.create({
    user: req.user._id,
    role,
    type,
    difficulty: safeDifficulty,
    duration: questionCount,
    resumeRef: resumeDoc ? resumeDoc._id : null,
    resumeFileName,
    resumeSummary: resumeText ? resumeText.slice(0, 300) : '',
    questions: generatedQuestions.map((q) => ({
      question: q.question,
      category: q.category || (type === 'hr' ? 'hr' : 'technical'),
    })),
    status: 'in-progress',
  });

  res.status(201).json({ success: true, data: interview });
});

// @route POST /api/interview/submit-answer
// @access Private (student)
const submitAnswer = asyncHandler(async (req, res) => {
  const {
    interviewId,
    questionIndex,
    answer,
    isVoice = false,
    transcript = '',
    audioDuration = 0,
    audioBase64,
    audioMimeType,
  } = req.body;

  if (interviewId === undefined || questionIndex === undefined || (!answer && !audioBase64 && !transcript)) {
    return res.status(400).json({
      success: false,
      message: 'interviewId, questionIndex, and answer/transcript are required',
    });
  }

  const interview = await MockInterview.findOne({ _id: interviewId, user: req.user._id });
  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview session not found or unauthorized' });
  }

  if (questionIndex < 0 || questionIndex >= interview.questions.length) {
    return res.status(400).json({ success: false, message: 'Invalid question index' });
  }

  const effectiveAnswer = (answer || transcript || '').trim();
  const q = interview.questions[questionIndex];

  // Decode audio buffer if base64 provided
  let audioBuffer = null;
  let cleanMimeType = audioMimeType || 'audio/webm';
  if (audioBase64 && typeof audioBase64 === 'string') {
    try {
      const parts = audioBase64.split(';base64,');
      if (parts.length === 2) {
        cleanMimeType = parts[0].replace('data:', '');
        audioBuffer = Buffer.from(parts[1], 'base64');
      } else {
        audioBuffer = Buffer.from(audioBase64, 'base64');
      }
    } catch (e) {
      console.warn('Could not parse audio buffer:', e.message);
    }
  }

  // Deep AI evaluation: technical/HR performance + communication dimensions
  const evaluation = await evaluateAnswerWithCommunication({
    question: q.question,
    answer: effectiveAnswer,
    role: interview.role,
    type: interview.type,
    category: q.category || 'technical',
    difficulty: interview.difficulty,
    audioBuffer,
    audioMimeType: cleanMimeType,
    isVoice: Boolean(isVoice),
    audioDuration: Number(audioDuration) || 0,
  });

  // Update question entry
  interview.questions[questionIndex].answer = effectiveAnswer;
  interview.questions[questionIndex].isVoice = Boolean(isVoice);
  interview.questions[questionIndex].transcript = transcript || effectiveAnswer;
  interview.questions[questionIndex].audioDuration = Number(audioDuration) || 0;

  // Performance scoring
  interview.questions[questionIndex].performanceScore = evaluation.performance.score;
  interview.questions[questionIndex].performanceFeedback = {
    correctness: evaluation.performance.correctness,
    depth: evaluation.performance.depth,
    problemSolving: evaluation.performance.problemSolving,
    explanationQuality: evaluation.performance.explanationQuality,
    structure: evaluation.performance.structure,
    comments: evaluation.performance.comments,
    strengths: evaluation.performance.strengths,
    improvements: evaluation.performance.improvements,
    modelAnswer: evaluation.performance.modelAnswer,
  };

  // Communication scoring
  interview.questions[questionIndex].communicationScore = evaluation.communication.score;
  interview.questions[questionIndex].communicationFeedback = {
    fluency: evaluation.communication.fluency,
    clarity: evaluation.communication.clarity,
    grammar: evaluation.communication.grammar,
    vocabulary: evaluation.communication.vocabulary,
    coherence: evaluation.communication.coherence,
    relevance: evaluation.communication.relevance,
    pronunciationDelivery: evaluation.communication.pronunciationDelivery,
    comments: evaluation.communication.comments,
  };

  // Legacy fields for backward compatibility
  interview.questions[questionIndex].score = evaluation.performance.score;
  interview.questions[questionIndex].feedback = {
    clarity: Math.round(evaluation.communication.clarity / 4),
    confidence: Math.round(evaluation.communication.fluency / 4),
    grammar: Math.round(evaluation.communication.grammar / 4),
    structure: Math.round(evaluation.communication.coherence / 4),
    comments: evaluation.performance.comments || evaluation.communication.comments,
  };

  // Follow-up question if applicable
  interview.questions[questionIndex].followUpQuestion = evaluation.followUpQuestion || '';

  // Check if all questions are answered
  const allAnswered = interview.questions.every((item) => item.answer && item.answer.trim().length > 0);

  if (allAnswered) {
    const answeredCount = interview.questions.length;
    const avgPerf = Math.round(
      interview.questions.reduce((sum, item) => sum + (item.performanceScore || item.score || 0), 0) / answeredCount
    );
    const avgComm = Math.round(
      interview.questions.reduce((sum, item) => sum + (item.communicationScore || 0), 0) / answeredCount
    );

    interview.overallPerformanceScore = avgPerf;
    interview.overallCommunicationScore = avgComm;
    // Composite score
    interview.overallScore = Math.round(avgPerf * 0.7 + avgComm * 0.3);
    interview.status = 'completed';

    // Generate full debrief summary
    interview.finalSummary = await generateInterviewSummary(interview);

    // Update student profile communication score (running weighted average)
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile) {
      const prevPracticed = profile.interviewsPracticed || 0;
      const currentComm = profile.skillScores?.communication || 0;
      const updatedComm = Math.round((currentComm * prevPracticed + avgComm) / (prevPracticed + 1));

      profile.skillScores.communication = Math.min(100, Math.max(0, updatedComm));
      profile.interviewsPracticed = prevPracticed + 1;
      profile.lastActiveDate = new Date();
      await profile.save();
    }

    await ActivityLog.create({
      user: req.user._id,
      type: 'interview_practice',
      description: `Completed ${interview.difficulty} ${interview.type} mock interview for ${interview.role} – Performance: ${avgPerf}%, Communication: ${avgComm}%`,
    });
  }

  await interview.save();

  res.json({
    success: true,
    data: {
      questionIndex,
      performanceScore: evaluation.performance.score,
      performanceFeedback: evaluation.performance,
      communicationScore: evaluation.communication.score,
      communicationFeedback: evaluation.communication,
      followUpQuestion: evaluation.followUpQuestion,
      interviewComplete: allAnswered,
      overallPerformanceScore: interview.overallPerformanceScore,
      overallCommunicationScore: interview.overallCommunicationScore,
      overallScore: interview.overallScore,
      finalSummary: interview.finalSummary,
      // legacy support
      score: evaluation.performance.score,
      feedback: interview.questions[questionIndex].feedback,
    },
  });
});

// @route POST /api/interview/end
// @access Private (student)
const endInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.body;
  if (!interviewId) {
    return res.status(400).json({ success: false, message: 'interviewId is required' });
  }

  const interview = await MockInterview.findOne({ _id: interviewId, user: req.user._id });
  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview session not found or unauthorized' });
  }

  const answeredQuestions = interview.questions.filter((q) => q.answer && q.answer.trim().length > 0);
  const count = answeredQuestions.length || 1;

  const avgPerf = Math.round(
    answeredQuestions.reduce((sum, item) => sum + (item.performanceScore || item.score || 0), 0) / count
  );
  const avgComm = Math.round(
    answeredQuestions.reduce((sum, item) => sum + (item.communicationScore || 0), 0) / count
  );

  interview.overallPerformanceScore = avgPerf;
  interview.overallCommunicationScore = avgComm;
  interview.overallScore = Math.round(avgPerf * 0.7 + avgComm * 0.3);
  interview.status = 'completed';

  interview.finalSummary = await generateInterviewSummary(interview);

  // Update profile
  const profile = await StudentProfile.findOne({ user: req.user._id });
  if (profile && answeredQuestions.length > 0) {
    const prevPracticed = profile.interviewsPracticed || 0;
    const currentComm = profile.skillScores?.communication || 0;
    profile.skillScores.communication = Math.round((currentComm * prevPracticed + avgComm) / (prevPracticed + 1));
    profile.interviewsPracticed = prevPracticed + 1;
    profile.lastActiveDate = new Date();
    await profile.save();
  }

  await ActivityLog.create({
    user: req.user._id,
    type: 'interview_practice',
    description: `Concluded ${interview.type} interview for ${interview.role} – Overall Score: ${interview.overallScore}%`,
  });

  await interview.save();

  res.json({
    success: true,
    data: interview,
  });
});

// @route GET /api/interview/history
// @access Private (student)
const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await MockInterview.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('role type difficulty duration overallScore overallPerformanceScore overallCommunicationScore status createdAt questions.question');

  res.json({ success: true, data: interviews });
});

// @route GET /api/interview/:id
// @access Private (student)
const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await MockInterview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview session not found or unauthorized' });
  }
  res.json({ success: true, data: interview });
});

module.exports = {
  getResumeStatus,
  uploadResumeForInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getInterviewHistory,
  getInterviewById,
};
