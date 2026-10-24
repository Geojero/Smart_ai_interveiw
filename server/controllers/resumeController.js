const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobRole = require('../models/JobRole');
const StudentProfile = require('../models/StudentProfile');
const ActivityLog = require('../models/ActivityLog');
const { extractTextFromFile, cleanupFile } = require('../services/resumeParser');
const { analyzeResume } = require('../services/aiService');
const { asyncHandler } = require('../middleware/error');

// @route POST /api/resume/analyze
// @access Private (student)
const analyzeResumeHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a resume file' });
  }

  const { targetRole, jobDescription } = req.body;
  if (!targetRole) {
    cleanupFile(req.file.path);
    return res.status(400).json({ success: false, message: 'Target role is required' });
  }

  // Extract text from uploaded file
  let extractedText;
  try {
    extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);
  } catch (err) {
    cleanupFile(req.file.path);
    return res.status(400).json({ success: false, message: 'Failed to extract text from file: ' + err.message });
  } finally {
    cleanupFile(req.file.path);
  }

  if (!extractedText || extractedText.trim().length < 100) {
    return res.status(400).json({ success: false, message: 'Resume appears to be empty or unreadable' });
  }

  // Get required skills from JobRole or use custom job description
  let requiredSkills = [];
  const jobRole = await JobRole.findOne({ title: { $regex: new RegExp(targetRole, 'i') } });
  if (jobRole) {
    requiredSkills = jobRole.requiredSkills;
  } else if (jobDescription) {
    // Extract skills from job description if no role found
    requiredSkills = jobDescription.split(',').map((s) => s.trim()).filter(Boolean);
  } else {
    requiredSkills = ['JavaScript', 'Python', 'Data Structures', 'Algorithms', 'SQL', 'Git', 'Problem Solving'];
  }

  // Call AI service
  const analysis = await analyzeResume(extractedText, targetRole, requiredSkills);

  // Save to DB
  const saved = await ResumeAnalysis.create({
    user: req.user._id,
    targetRole,
    fileName: req.file.originalname,
    extractedText,
    atsScore: analysis.atsScore,
    matchedSkills: analysis.matchedSkills,
    missingSkills: analysis.missingSkills,
    sectionFeedback: analysis.sectionFeedback,
    suggestions: analysis.suggestions,
    keywordTips: analysis.keywordTips,
  });

  // Update student profile resume score
  await StudentProfile.findOneAndUpdate(
    { user: req.user._id },
    { 'skillScores.resume': Math.round(analysis.atsScore) }
  );

  await ActivityLog.create({
    user: req.user._id,
    type: 'resume_upload',
    description: `Analyzed resume for ${targetRole} – ATS Score: ${analysis.atsScore}`,
  });

  res.status(201).json({ success: true, data: saved });
});

// @route GET /api/resume/history
// @access Private (student)
const getResumeHistory = asyncHandler(async (req, res) => {
  const analyses = await ResumeAnalysis.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select('-extractedText');
  res.json({ success: true, data: analyses });
});

// @route GET /api/resume/history/:id
// @access Private (student)
const getResumeById = asyncHandler(async (req, res) => {
  const analysis = await ResumeAnalysis.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!analysis) {
    return res.status(404).json({ success: false, message: 'Analysis not found' });
  }
  res.json({ success: true, data: analysis });
});

module.exports = { analyzeResumeHandler, getResumeHistory, getResumeById };
