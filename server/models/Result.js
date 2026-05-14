/**
 * Result Model
 * Stores AI analysis results linked to a submission
 */

const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    sub_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    match_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matched_skills: {
      type: [String],
      default: [],
    },
    missing_skills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    job_role: {
      type: String,
      default: "",
    },
    total_required: {
      type: Number,
      default: 0,
    },
    total_matched: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
