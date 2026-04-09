export default function TimerDisplay({ timeLeft, started, finished }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pct = timeLeft / 600;

  const accentColor =
    pct > 0.5 ? "#1a1a2e" : pct > 0.25 ? "#b45309" : "#b91c1c";
  const trackColor =
    pct > 0.5 ? "#e2e8f0" : pct > 0.25 ? "#fef3c7" : "#fee2e2";
  const fillColor =
    pct > 0.5 ? "#1a1a2e" : pct > 0.25 ? "#d97706" : "#dc2626";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <div
        style={{
          fontFamily: "'DM Mono', 'Fira Mono', monospace",
          fontSize: "28px",
          fontWeight: 500,
          letterSpacing: "-0.5px",
          color: accentColor,
          minWidth: "72px",
          transition: "color 0.5s",
        }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div
          style={{
            height: "4px",
            background: trackColor,
            borderRadius: "99px",
            overflow: "hidden",
            transition: "background 0.5s",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: fillColor,
              borderRadius: "99px",
              transition: "width 1s linear, background 0.5s",
            }}
          />
        </div>
        <p
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          {!started
            ? "Start typing to begin"
            : finished
            ? "Session complete"
            : "Time remaining"}
        </p>
      </div>
    </div>
  );
}