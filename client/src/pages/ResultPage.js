import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResultById } from "../services/api";
import { MatchDonutChart, SkillBarChart } from "../components/SkillChart";

const ResultPage = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getResultById(id);
        setResult(data.result);
      } catch {
        setError("Could not load result.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading result...</p>;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!result) return null;

  const scoreColor = result.match_score >= 70 ? "#00d4aa" : result.match_score >= 40 ? "#f59e0b" : "#ef4444";

  const scoreLabel =
    result.match_score >= 70 ? "Strong Match 🎉" :
    result.match_score >= 40 ? "Fair Match 📈" :
                               "Needs Work 💪";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 className="page-title">Analysis <span>Results</span></h1>
          <p className="page-subtitle">
            Role: <strong style={{ color: "#e2e8f0" }}>
              {result.job_role?.charAt(0).toUpperCase() + result.job_role?.slice(1)}
            </strong>
            {result.sub_id?.uploaded_at && (
              <> · {new Date(result.sub_id.uploaded_at).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <Link to="/upload" className="btn btn-ghost" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>
          + New
        </Link>
      </div>

      {/* Score + Donut chart */}
      <div className="card" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div className="score-circle" style={{ borderColor: scoreColor, boxShadow: `0 0 30px ${scoreColor}30` }}>
          <div className="score-number" style={{ color: scoreColor }}>
            {result.match_score}%
          </div>
          <div className="score-label">Match</div>
        </div>
        <h2 style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.1rem", color: scoreColor }}>
          {scoreLabel}
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          {result.total_matched} of {result.total_required} required skills found in your resume
        </p>

        <div style={{ maxWidth: 260, margin: "1.5rem auto 0" }}>
          <MatchDonutChart matchScore={result.match_score} />
        </div>
      </div>

      {/* Skill bar chart */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p className="section-title">Skill Breakdown</p>
        <SkillBarChart
          matchedSkills={result.matched_skills}
          missingSkills={result.missing_skills}
        />
      </div>

      {/* Matched skills */}
      {result.matched_skills?.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <p className="section-title">✅ Matched Skills ({result.matched_skills.length})</p>
          <div className="chip-list">
            {result.matched_skills.map((skill) => (
              <span key={skill} className="chip chip-matched">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {result.missing_skills?.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <p className="section-title">❌ Missing Skills ({result.missing_skills.length})</p>
          <div className="chip-list">
            {result.missing_skills.map((skill) => (
              <span key={skill} className="chip chip-missing">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {result.suggestions?.length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <p className="section-title">💡 Recommendations</p>
          {result.suggestions.map((s, i) => (
            <div key={i} className="suggestion-item">
              <span>→</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Back to dashboard */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link to="/dashboard" className="btn btn-ghost">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ResultPage;
