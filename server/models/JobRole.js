const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job role title is required'],
      unique: true,
      trim: true,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobRole', jobRoleSchema);
