const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true,
    },
    track: {
      type: String,
      enum: ['dsa', 'it'],
      required: [true, 'Track is required'],
    },
    order: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '📚',
    },
  },
  { timestamps: true }
);

topicSchema.index({ track: 1, order: 1 });

module.exports = mongoose.model('Topic', topicSchema);
