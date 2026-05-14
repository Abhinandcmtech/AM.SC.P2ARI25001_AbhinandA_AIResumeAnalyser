/**
 * Submission Model
 * Records each resume upload with the target job role
 */

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target_job: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      default: "",
    },
    uploaded_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
