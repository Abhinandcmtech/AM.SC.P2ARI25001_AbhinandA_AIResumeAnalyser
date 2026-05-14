import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem("token");
  const user      = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "#0d1321",
      borderBottom: "1px solid #1e2a3a",
      padding: "0 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "60px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.4rem" }}>⚡</span>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#00d4aa",
          letterSpacing: "-0.02em"
        }}>
          ResumeAI
        </span>
      </Link>

      {/* Nav links */}
      {token && (
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link to="/dashboard" style={{
            textDecoration: "none",
            color: isActive("/dashboard") ? "#00d4aa" : "#64748b",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Dashboard
          </Link>
          <Link to="/upload" style={{
            textDecoration: "none",
            color: isActive("/upload") ? "#00d4aa" : "#64748b",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Upload
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
              {user.name?.split(" ")[0]}
            </span>
            <button onClick={handleLogout} style={{
              background: "transparent",
              border: "1px solid #1e2a3a",
              borderRadius: "6px",
              color: "#64748b",
              padding: "0.35rem 0.85rem",
              cursor: "pointer",
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
            }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
