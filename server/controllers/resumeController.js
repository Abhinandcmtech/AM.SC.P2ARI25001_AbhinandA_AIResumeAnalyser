/**
 * Resume Controller
 * Handles PDF upload, forwards to Python AI service, saves results
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Submission = require("../models/Submission");
const Result = require("../models/Result");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:5001";

// ── POST /api/resume/upload ────────────────────────────────────
const uploadResume = async (req, res) => {
  // Check file was uploaded by Multer
  if (!req.file) {
    return res.status(400).json({ message: "No PDF file uploaded" });
  }

  const { job_role } = req.body;

  if (!job_role) {
    // Clean up temp file
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ message: "Job role is required" });
  }

  try {
    // ── Step 1: Save submission record ──────────────────────────
    const submission = await Submission.create({
      user_id: req.user._id,
      target_job: job_role,
      filename: req.file.originalname,
    });

    // ── Step 2: Forward file to Python AI service ────────────────
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: "application/pdf",
    });
    formData.append("job_role", job_role);

    let aiResult;
    try {
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/analyze`,
        formData,
        {
          headers: formData.getHeaders(),
          timeout: 15000, // 15 second timeout
        }
      );
      aiResult = aiResponse.data;
    } catch (aiError) {
      // If AI service is down, return a helpful error
      const msg = aiError.code === "ECONNREFUSED"
        ? "AI service is not running. Please start the Python service."
        : aiError.message;

      await submission.deleteOne(); // rollback submission
      fs.unlink(req.file.path, () => {});
      return res.status(503).json({ message: msg });
    }

    // ── Step 3: Save result to MongoDB ───────────────────────────
    const result = await Result.create({
      sub_id: submission._id,
      user_id: req.user._id,
      match_score: aiResult.match_score,
      matched_skills: aiResult.matched_skills || [],
      missing_skills: aiResult.missing_skills || [],
      suggestions: aiResult.suggestions || [],
      job_role: aiResult.job_role || job_role,
      total_required: aiResult.total_required || 0,
      total_matched: aiResult.total_matched || 0,
    });

    // ── Step 4: Clean up temp file ───────────────────────────────
    fs.unlink(req.file.path, () => {});

    // ── Step 5: Return combined result ──────────────────────────
    res.status(201).json({
      message: "Resume analyzed successfully",
      submission_id: submission._id,
      result,
    });
  } catch (error) {
    // Clean up on any unexpected error
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadResume };
