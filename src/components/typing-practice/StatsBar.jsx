function StatCard({ label, value, unit, color, bg }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 20px",
        borderRadius: "12px",
        background: bg || "#f8fafc",
        border: "1px solid #f1f5f9",
        flex: 1,
        minWidth: "80px",
      }}
    >
      <span
        style={{
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: "22px",
          fontWeight: 500,
          color: color || "#1a1a2e",
          lineHeight: 1,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: "13px", color: "#94a3b8", marginLeft: "2px" }}>
            {unit}
          </span>
        )}
      </span>
      <span
        style={{
          fontSize: "10px",
          color: "#94a3b8",
          marginTop: "5px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function StatsBar({ wpm, accuracy, correctChars, incorrectChars }) {
  const accColor =
    accuracy >= 95 ? "#15803d" : accuracy >= 80 ? "#b45309" : "#b91c1c";
  const accBg =
    accuracy >= 95 ? "#f0fdf4" : accuracy >= 80 ? "#fffbeb" : "#fff1f2";

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <StatCard label="WPM" value={wpm} color="#1a1a2e" bg="#f8fafc" />
      <StatCard
        label="Accuracy"
        value={accuracy}
        unit="%"
        color={accColor}
        bg={accBg}
      />
      <StatCard label="Correct" value={correctChars} color="#15803d" bg="#f0fdf4" />
      <StatCard label="Errors" value={incorrectChars} color="#b91c1c" bg="#fff1f2" />
    </div>
  );
}