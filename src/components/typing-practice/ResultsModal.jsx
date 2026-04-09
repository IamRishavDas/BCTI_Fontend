export default function ResultsModal({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  timeLeft,
  onRetry,
  onNew,
}) {
  const timeTaken = 600 - timeLeft;
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  const grade =
    wpm >= 60 && accuracy >= 95
      ? { label: "Excellent", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" }
      : wpm >= 40 && accuracy >= 85
      ? { label: "Good job", color: "#1a1a2e", bg: "#f8fafc", border: "#e2e8f0" }
      : { label: "Keep going", color: "#b45309", bg: "#fffbeb", border: "#fde68a" };

  const stats = [
    { label: "WPM", value: wpm, color: "#1a1a2e" },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      color: accuracy >= 95 ? "#15803d" : accuracy >= 80 ? "#b45309" : "#b91c1c",
    },
    { label: "Correct", value: correctChars, color: "#15803d" },
    { label: "Errors", value: incorrectChars, color: "#b91c1c" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,0.3)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          padding: "32px",
          width: "100%",
          maxWidth: "420px",
          margin: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
          animation: "tpModalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "4px 12px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.04em",
              background: grade.bg,
              color: grade.color,
              border: `1px solid ${grade.border}`,
            }}
          >
            {grade.label}
          </span>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#1a1a2e",
              fontFamily: "'DM Sans', sans-serif",
              marginTop: "4px",
            }}
          >
            Session complete
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
            Completed in {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "18px 12px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', 'Fira Mono', monospace",
                  fontSize: "28px",
                  fontWeight: 500,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              background: "#f8fafc",
              color: "#1a1a2e",
              border: "1px solid #e2e8f0",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.target.style.background = "#f8fafc")}
          >
            Try again
          </button>
          <button
            onClick={onNew}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              background: "#1a1a2e",
              color: "#ffffff",
              border: "1px solid #1a1a2e",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2d2d4e")}
            onMouseLeave={(e) => (e.target.style.background = "#1a1a2e")}
          >
            New paragraph
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tpModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}