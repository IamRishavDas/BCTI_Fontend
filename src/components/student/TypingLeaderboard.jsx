import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const initials = (name) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

const AVATAR_PALETTES = [
  { bg: "#eff6ff", fg: "#2563eb", border: "#bfdbfe" },
  { bg: "#f0fdf4", fg: "#16a34a", border: "#bbf7d0" },
  { bg: "#fffbeb", fg: "#d97706", border: "#fde68a" },
  { bg: "#fdf2f8", fg: "#9333ea", border: "#f0abfc" },
  { bg: "#fff1f2", fg: "#e11d48", border: "#fecdd3" },
];

const RANK_META = {
  0: { color: "#ca8a04", bar: "linear-gradient(90deg,#fbbf24,#f59e0b)", medal: "🥇" },
  1: { color: "#64748b", bar: "linear-gradient(90deg,#cbd5e1,#94a3b8)", medal: "🥈" },
  2: { color: "#b45309", bar: "linear-gradient(90deg,#fcd34d,#d97706)", medal: "🥉" },
};

function PlayerChart({ player }) {
  const labels = player.typingSpeed.map((_, i) => `Session ${i + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "WPM",
        data: player.typingSpeed,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.06)",
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
        yAxisID: "yWpm",
      },
      {
        label: "Accuracy",
        data: player.typingAccuracy,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.04)",
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
        yAxisID: "yAcc",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#94a3b8",
        bodyColor: "#f1f5f9",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) =>
            ctx.datasetIndex === 0
              ? `  ${ctx.parsed.y} WPM`
              : `  ${ctx.parsed.y}% Accuracy`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { color: "#94a3b8", font: { size: 11 } },
      },
      yWpm: {
        type: "linear",
        position: "left",
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { color: "#10b981", font: { size: 11 }, callback: (v) => v + " wpm" },
      },
      yAcc: {
        type: "linear",
        position: "right",
        min: 0,
        max: 100,
        grid: { display: false },
        ticks: { color: "#f59e0b", font: { size: 11 }, callback: (v) => v + "%" },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          WPM per session
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          Accuracy %
        </span>
      </div>

      {/* Chart */}
      <div style={{ position: "relative", width: "100%", height: 200 }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Session pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {player.typingSpeed.map((spd, i) => (
          <div
            key={i}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-100 bg-gray-50 flex gap-2 text-gray-500"
          >
            <span className="text-gray-400">s{i + 1}</span>
            <span className="font-semibold text-emerald-600">{spd} wpm</span>
            <span className="text-gray-300">·</span>
            <span className="font-semibold text-amber-500">{player.typingAccuracy[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerCard({ player, rank, index }) {
  const [open, setOpen] = useState(false);
  const palette = AVATAR_PALETTES[rank % AVATAR_PALETTES.length];
  const rankMeta = RANK_META[rank];
  const bestWpm = Math.max(...player.typingSpeed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow overflow-hidden"
      style={{
        outline: open ? "1.5px solid #e2e8f0" : "1.5px solid transparent",
        transition: "outline-color 0.2s",
      }}
    >
      {/* Rank accent bar for top 3 */}
      {rankMeta && (
        <div style={{ height: 3, background: rankMeta.bar }} />
      )}

      {/* Header row */}
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors select-none"
      >
        {/* Rank / Medal */}
        <div
          className="text-sm font-bold min-w-[28px]"
          style={{ color: rankMeta?.color ?? "#94a3b8" }}
        >
          {rankMeta ? rankMeta.medal : `#${rank + 1}`}
        </div>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
          style={{
            background: palette.bg,
            color: palette.fg,
            border: `1.5px solid ${palette.border}`,
          }}
        >
          {initials(player.studentName)}
        </div>

        {/* Name + sub info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">
            {player.studentName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {player.typingSpeed.length} session{player.typingSpeed.length !== 1 ? "s" : ""}
            &nbsp;·&nbsp; best{" "}
            <span className="text-emerald-500 font-medium">{bestWpm} WPM</span>
          </p>
        </div>

        {/* Stat numbers */}
        <div className="flex gap-6 items-center">
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600 leading-none">
              {Math.round(player.avgSpeed)}
            </p>
            <p className="text-xs text-gray-400 mt-1">avg wpm</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-500 leading-none">
              {Math.round(player.avgAcc)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">accuracy</p>
          </div>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-300 text-xs ml-1"
        >
          ▼
        </motion.span>
      </div>

      {/* Expandable chart */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chart"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6 pb-6 pt-4 border-t border-gray-50">
              <PlayerChart player={player} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TypingLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const res = await api.getTypingLeaderboard();
    if (res.success) {
      const ranked = (res.data || [])
        .map((p) => ({
          ...p,
          avgSpeed: avg(p.typingSpeed),
          avgAcc: avg(p.typingAccuracy),
        }))
        .sort((a, b) => b.avgSpeed - a.avgSpeed);
      setLeaderboard(ranked);
    } else {
      showError("Failed to load leaderboard");
    }
    setLoading(false);
  };

  const globalBest = leaderboard.length
    ? Math.max(...leaderboard.flatMap((p) => p.typingSpeed))
    : 0;
  const globalAcc = leaderboard.length
    ? Math.round(avg(leaderboard.map((p) => p.avgAcc)))
    : 0;
  const totalSessions = leaderboard.reduce((s, p) => s + p.typingSpeed.length, 0);

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-4xl font-semibold text-gray-900">Typing Leaderboard</h1>
        <p className="text-gray-500 mt-2">
          Click any student to see their full session breakdown
        </p>
      </div>

      {/* Global stat cards */}
      {!loading && leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Top Speed",      value: `${globalBest} WPM`, color: "text-emerald-600", delay: 0    },
            { label: "Avg Accuracy",   value: `${globalAcc}%`,     color: "text-amber-500",   delay: 0.1  },
            { label: "Players",        value: leaderboard.length,  color: "text-blue-600",    delay: 0.2  },
            { label: "Total Sessions", value: totalSessions,        color: "text-purple-500",  delay: 0.3  },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: s.delay }}
              className="bg-white rounded-3xl p-8 shadow"
            >
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className={`text-5xl font-bold mt-3 ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Player cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl shadow p-8">
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          leaderboard.map((player, i) => (
            <PlayerCard key={player.studentName} player={player} rank={i} index={i} />
          ))
        ) : (
          <div className="bg-white rounded-3xl shadow p-8">
            <p className="text-gray-500">No data yet. Start typing today!</p>
          </div>
        )}
      </div>
    </div>
  );
}