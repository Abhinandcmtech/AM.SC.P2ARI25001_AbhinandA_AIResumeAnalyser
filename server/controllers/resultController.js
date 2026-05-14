/**
 * Result Controller
 * Fetches analysis results for the authenticated user
 */

const Result = require("../models/Result");
const Submission = require("../models/Submission");

// ── GET /api/results ───────────────────────────────────────────
const getUserResults = async (req, res) => {
  try {
    // Get all results for this user, newest first
    const results = await Result.find({ user_id: req.user._id })
      .sort({ createdAt: -1 })
      .populate("sub_id", "target_job filename uploaded_at");

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ── GET /api/results/:id ───────────────────────────────────────
const getResultById = async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.id,
      user_id: req.user._id, // Ensure ownership
    }).populate("sub_id", "target_job filename uploaded_at");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getUserResults, getResultById };
