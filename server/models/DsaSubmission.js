const mongoose = require('mongoose');

const dsaSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DsaProblem',
      required: true,
      index: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'cpp', 'java'],
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Compilation Error',
        'Runtime Error',
        'Internal Error',
      ],
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    memoryKb: {
      type: Number,
      default: 0,
    },
    passedTestCases: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    failedTestCase: {
      input: String,
      expectedOutput: String,
      actualOutput: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DsaSubmission', dsaSubmissionSchema);
