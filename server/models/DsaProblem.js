const mongoose = require('mongoose');

const dsaProblemSchema = new mongoose.Schema(
  {
    problemId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      enum: [
        'Arrays & Strings',
        'Hashing',
        'Two Pointers / Sliding Window',
        'Sorting & Searching',
        'Linked List',
        'Stack & Queue',
        'Recursion & Backtracking',
        'Trees',
        'Graphs',
        'Dynamic Programming',
      ],
      index: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium'],
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    tags: [String],
    hints: [String],
    starterCodes: {
      javascript: { type: String, default: '' },
      python: { type: String, default: '' },
      cpp: { type: String, default: '' },
      java: { type: String, default: '' },
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, default: '' },
        isHidden: { type: Boolean, default: false },
        explanation: { type: String },
      },
    ],
    solution: {
      approach: { type: String, default: '' },
      timeComplexity: { type: String, default: '' },
      spaceComplexity: { type: String, default: '' },
      code: {
        javascript: { type: String, default: '' },
        python: { type: String, default: '' },
        cpp: { type: String, default: '' },
        java: { type: String, default: '' },
      },
    },
    order: {
      type: Number,
      default: 1,
    },
    acceptanceRate: {
      type: Number,
      default: 75,
    },
    isFresherPriority: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DsaProblem', dsaProblemSchema);
