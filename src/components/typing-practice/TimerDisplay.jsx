
export default function TimerDisplay({ timeLeft, started, finished }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pct = timeLeft / 600;

  const color =
    pct > 0.5 ? "#2563eb" : pct > 0.25 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="text-4xl font-mono font-bold tabular-nums tracking-tight"
        style={{ color, transition: "color 0.5s" }}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct * 100}%`, background: color }}
        />
      </div>
      <p className="text-xs" style={{ color: "#94a3b8" }}>
        {!started ? "Start typing to begin" : finished ? "Completed!" : "Time remaining"}
      </p>
    </div>
  );
}