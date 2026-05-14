import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResults } from "../services/api";

const Dashboard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await getResults();
        setResults(data.results);
      } catch {
        // silently fail — user just has no results yet
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const scoreColor = (score) => {
    if (score >= 70) return "#00d4aa";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div>
      {/* Welcome header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">
          Hey, <span>{user.name?.split(" ")[0] || "there"}</span> 👋
        </h1>
        <p className="page-subtitle">Here are your resume analyses</p>
      </div>

      {/* Stats row */}
      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "2.5rem", color: "#00d4aa" }}>
            {results.length}
          </div>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Analyses Run
          </div>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "2.5rem", color: "#f59e0b" }}>
            {results.length > 0
              ? Math.round(results.reduce((a, r) => a + r.match_score, 0) / results.length)
              : "--"}%
          </div>
          <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Avg. Match Score
          </div>
        </div>
      </div>

      {/* Upload CTA */}
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", color: "#e2e8f0" }}>
          Analysis History
        </h2>
        <Link to="/upload" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
          + New Analysis
        </Link>
      </div>

      {/* Results list */}
      {loading ? (
        <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading...</p>
      ) : results.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</div>
          <p style={{ color: "#64748b" }}>No analyses yet.</p>
          <Link to="/upload" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Upload Your Resume
          </Link>
        </div>
      ) : (
        results.map((result) => (
          <Link
            key={result._id}
            to={`/results/${result._id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="history-item">
              <div>
                <div style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: "0.2rem" }}>
                  {result.job_role
                    ? result.job_role.charAt(0).toUpperCase() + result.job_role.slice(1)
                    : result.sub_id?.target_job || "Unknown Role"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {new Date(result.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric"
                  })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: scoreColor(result.match_score),
                }}>
                  {result.match_score}%
                </span>
                <span style={{ color: "#64748b" }}>→</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Dashboard;
