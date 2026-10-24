const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    sectionFeedback: {
      summary: { type: String, default: '' },
      experience: { type: String, default: '' },
      education: { type: String, default: '' },
      skills: { type: String, default: '' },
      projects: { type: String, default: '' },
    },
    suggestions: [
      {
        section: String,
        before: String,
        after: String,
        reason: String,
      },
    ],
    keywordTips: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
