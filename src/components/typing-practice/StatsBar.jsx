import React from "react";

function StatCard({ label, value, unit, color }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl"
      style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
    >
      <span
        className="text-2xl font-bold font-mono tabular-nums"
        style={{ color: color || "#1e293b" }}
      >
        {value}
        {unit && (
          <span className="text-sm font-semibold ml-0.5" style={{ color: "#94a3b8" }}>
            {unit}
          </span>
        )}
      </span>
      <span className="text-xs font-medium mt-0.5" style={{ color: "#94a3b8" }}>
        {label}
      </span>
    </div>
  );
}

export default function StatsBar({ wpm, accuracy, correctChars, incorrectChars }) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      <StatCard label="WPM" value={wpm} color="#2563eb" />
      <StatCard
        label="Accuracy"
        value={accuracy}
        unit="%"
        color={accuracy >= 95 ? "#16a34a" : accuracy >= 80 ? "#f59e0b" : "#ef4444"}
      />
      <StatCard label="Correct" value={correctChars} color="#16a34a" />
      <StatCard label="Errors" value={incorrectChars} color="#ef4444" />
    </div>
  );
}