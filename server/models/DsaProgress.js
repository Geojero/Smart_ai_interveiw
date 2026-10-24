const mongoose = require('mongoose');

const dsaProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DsaProblem',
      },
    ],
    attemptedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DsaProblem',
      },
    ],
    bookmarkedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DsaProblem',
      },
    ],
    savedCode: [
      {
        problem: { type: mongoose.Schema.Types.ObjectId, ref: 'DsaProblem' },
        language: String,
        code: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
    },
    stats: {
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DsaProgress', dsaProgressSchema);
