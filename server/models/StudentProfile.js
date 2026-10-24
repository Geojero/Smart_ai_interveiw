const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    targetRole: {
      type: String,
      default: 'Software Engineer',
    },
    college: {
      type: String,
      default: '',
    },
    graduationYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    skillScores: {
      communication: { type: Number, default: 0, min: 0, max: 100 },
      dsa: { type: Number, default: 0, min: 0, max: 100 },
      problemSolving: { type: Number, default: 0, min: 0, max: 100 },
      coreCS: { type: Number, default: 0, min: 0, max: 100 },
      resume: { type: Number, default: 0, min: 0, max: 100 },
      aptitude: { type: Number, default: 0, min: 0, max: 100 },
    },
    interviewsPracticed: {
      type: Number,
      default: 0,
    },
    weeklyActivity: [
      {
        date: Date,
        count: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
