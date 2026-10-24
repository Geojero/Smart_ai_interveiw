const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['hr', 'technical', 'mixed'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    duration: {
      type: Number,
      default: 5, // number of questions
    },
    resumeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeAnalysis',
    },
    resumeFileName: {
      type: String,
      default: '',
    },
    resumeSummary: {
      type: String,
      default: '',
    },
    questions: [
      {
        question: { type: String, required: true },
        category: { type: String, enum: ['technical', 'hr', 'general'], default: 'technical' },
        answer: { type: String, default: '' },
        isVoice: { type: Boolean, default: false },
        transcript: { type: String, default: '' },
        audioDuration: { type: Number, default: 0 },
        score: { type: Number, default: 0, min: 0, max: 100 }, // combined score for backward compatibility
        performanceScore: { type: Number, default: 0, min: 0, max: 100 },
        performanceFeedback: {
          correctness: { type: Number, default: 0 },
          depth: { type: Number, default: 0 },
          problemSolving: { type: Number, default: 0 },
          explanationQuality: { type: Number, default: 0 },
          structure: { type: Number, default: 0 },
          comments: { type: String, default: '' },
          strengths: [{ type: String }],
          improvements: [{ type: String }],
          modelAnswer: { type: String, default: '' },
        },
        communicationScore: { type: Number, default: 0, min: 0, max: 100 },
        communicationFeedback: {
          fluency: { type: Number, default: 0 },
          clarity: { type: Number, default: 0 },
          grammar: { type: Number, default: 0 },
          vocabulary: { type: Number, default: 0 },
          coherence: { type: Number, default: 0 },
          relevance: { type: Number, default: 0 },
          pronunciationDelivery: { type: Number, default: null },
          comments: { type: String, default: '' },
        },
        followUpQuestion: { type: String, default: '' },
        feedback: {
          clarity: { type: Number, default: 0 },
          confidence: { type: Number, default: 0 },
          grammar: { type: Number, default: 0 },
          structure: { type: Number, default: 0 },
          comments: { type: String, default: '' },
        },
      },
    ],
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallPerformanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallCommunicationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalSummary: {
      summary: { type: String, default: '' },
      strengths: [{ type: String }],
      areasForImprovement: [{ type: String }],
      topicsToRevise: [{ type: String }],
      recommendedNextSteps: [{ type: String }],
      practiceQuestions: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
