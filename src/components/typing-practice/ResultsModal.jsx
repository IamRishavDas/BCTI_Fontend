
export default function ResultsModal({ wpm, accuracy, correctChars, incorrectChars, timeLeft, onRetry, onNew }) {
  const timeTaken = 600 - timeLeft;
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  const grade =
    wpm >= 60 && accuracy >= 95
      ? { label: "Excellent!", color: "#16a34a", bg: "#f0fdf4" }
      : wpm >= 40 && accuracy >= 85
      ? { label: "Good Job!", color: "#2563eb", bg: "#eff6ff" }
      : { label: "Keep Practicing!", color: "#f59e0b", bg: "#fffbeb" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 flex flex-col gap-6"
        style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
      >
        {/* Grade badge */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="px-5 py-2 rounded-full text-sm font-bold"
            style={{ background: grade.bg, color: grade.color }}
          >
            {grade.label}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Session Complete</h2>
          <p className="text-sm text-gray-400">
            Time: {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "WPM", value: wpm, color: "#2563eb" },
            { label: "Accuracy", value: `${accuracy}%`, color: accuracy >= 95 ? "#16a34a" : "#f59e0b" },
            { label: "Correct Chars", value: correctChars, color: "#16a34a" },
            { label: "Errors", value: incorrectChars, color: "#ef4444" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-4 rounded-2xl"
              style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
            >
              <span className="text-3xl font-bold font-mono" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="text-xs font-medium mt-1" style={{ color: "#94a3b8" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
            }}
          >
            Try Again
          </button>
          <button
            onClick={onNew}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "#2563eb" }}
          >
            New Paragraph
          </button>
        </div>
      </div>
    </div>
  );
}