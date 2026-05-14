import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/api";

// Available job roles matching the AI service
const JOB_ROLES = [
  "data scientist",
  "web developer",
  "frontend developer",
  "backend developer",
  "full stack developer",
  "software engineer",
  "devops engineer",
  "data analyst",
  "machine learning engineer",
  "cybersecurity analyst",
];

const UploadPage = () => {
  const navigate  = useNavigate();
  const fileInput = useRef(null);

  const [file, setFile]       = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Handle file via click or drag-drop
  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File must be under 5 MB.");
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)    return setError("Please select a PDF file.");
    if (!jobRole) return setError("Please select a job role.");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume",   file);
      formData.append("job_role", jobRole);

      const { data } = await uploadResume(formData);
      navigate(`/results/${data.result._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Is the AI service running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Upload <span>Resume</span></h1>
      <p className="page-subtitle">Upload a PDF and select a target job role to get your match score</p>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Drag-drop zone */}
          <div
            className={`dropzone ${dragOver ? "active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInput.current.click()}
          >
            <div className="dropzone-icon">📄</div>
            <p className="dropzone-text">
              <strong>Click to browse</strong> or drag & drop your PDF here
            </p>
            <p style={{ color: "#475569", fontSize: "0.78rem", marginTop: "0.3rem" }}>
              PDF only · max 5 MB
            </p>
            {file && (
              <p className="dropzone-filename">✓ {file.name}</p>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Job role selector */}
          <div className="form-group">
            <label>Target Job Role</label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            >
              <option value="">-- Select a role --</option>
              {JOB_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !file || !jobRole}
          >
            {loading ? (
              <><span className="spinner" style={{ borderTopColor: "#0a0e1a" }} /> Analyzing resume...</>
            ) : (
              "Analyze Resume →"
            )}
          </button>
        </form>

        {loading && (
          <div style={{ textAlign: "center", marginTop: "1.5rem", color: "#64748b", fontSize: "0.85rem" }}>
            <p>🤖 AI is extracting skills and computing your match score...</p>
            <p style={{ marginTop: "0.3rem" }}>This may take up to 10 seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
