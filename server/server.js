/**
 * AI Resume Analyzer - Node.js Backend
 * Main server entry point
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ──────────────────────────────────────────────────
const authRoutes    = require("./routes/authRoutes");
const resumeRoutes  = require("./routes/resumeRoutes");
const resultRoutes  = require("./routes/resultRoutes");

app.use("/api/auth",    authRoutes);
app.use("/api/resume",  resumeRoutes);
app.use("/api/results", resultRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "AI Resume Analyzer API is running" });
});

// ─── MongoDB Connection ───────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/resume_analyzer";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;
