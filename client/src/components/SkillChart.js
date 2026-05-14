import React from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// ── Doughnut chart showing match vs gap ──────────────────────
export const MatchDonutChart = ({ matchScore }) => {
  const gap = 100 - matchScore;

  const data = {
    labels: ["Matched", "Gap"],
    datasets: [{
      data: [matchScore, gap],
      backgroundColor: ["#00d4aa", "#1e2a3a"],
      borderColor:     ["#00d4aa", "#2d3a4a"],
      borderWidth: 2,
    }],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        labels: { color: "#e2e8f0", font: { family: "DM Sans" } }
      }
    },
  };

  return (
    <div style={{ maxWidth: 220, margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

// ── Bar chart: matched vs missing skill counts ───────────────
export const SkillBarChart = ({ matchedSkills = [], missingSkills = [] }) => {
  const data = {
    labels: ["Matched Skills", "Missing Skills"],
    datasets: [{
      label: "Skill Count",
      data: [matchedSkills.length, missingSkills.length],
      backgroundColor: ["rgba(0,212,170,0.7)", "rgba(239,68,68,0.6)"],
      borderColor:     ["#00d4aa", "#ef4444"],
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title:  { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid:  { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", stepSize: 1 },
        grid:  { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};
