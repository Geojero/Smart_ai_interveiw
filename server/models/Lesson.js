const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Lesson content is required'],
    },
    examples: [
      {
        title: String,
        code: String,
        explanation: String,
      },
    ],
    practiceProblems: [
      {
        title: String,
        difficulty: {
          type: String,
          enum: ['easy', 'medium', 'hard'],
          default: 'easy',
        },
        description: String,
        hint: String,
        solution: String,
      },
    ],
    order: {
      type: Number,
      required: true,
    },
    estimatedMinutes: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
