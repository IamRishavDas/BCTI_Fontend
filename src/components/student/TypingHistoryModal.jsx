// src/components/student/TypingHistoryModal.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from "chart.js";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const getAccuracy = (r) => {
  const total = r.correct + r.wrong;
  return total > 0 ? Math.round((r.correct / total) * 100) : 0;
};

const pillClass = (acc) =>
  acc >= 90
    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
    : acc >= 75
    ? "bg-amber-50 border-amber-100 text-amber-700"
    : "bg-gray-50 border-gray-200 text-gray-500";

export default function TypingHistoryModal({ isOpen, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    if (isOpen) {
      setReports([]);
      setCurrentPage(1);
      setActiveIdx(null);
      loadReports(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (reports.length > 0) setActiveIdx(reports.length - 1);
  }, [reports.length]);

  const loadReports = async (page) => {
    setLoading(true);
    try {
      const res = await api.getMyTypingScoresFromPractice(page, pageSize);
      if (res.data?.success) {
        const newReports = res.data.data || [];
        setReports((prev) => [...prev, ...newReports]);
        setHasMore(newReports.length === pageSize);
      }
    } catch {
      showError("Failed to load typing history");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    loadReports(next);
  };

  const bestWpm = reports.length ? Math.max(...reports.map((r) => r.wpm)) : 0;
  const avgWpm = reports.length
    ? Math.round(reports.reduce((s, r) => s + r.wpm, 0) / reports.length)
    : 0;

  const sorted = [...reports].sort(
    (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)
  );

  const chartData = {
    labels: sorted.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: "WPM",
        data: sorted.map((r) => r.wpm),
        yAxisID: "y",
        borderColor: "#1D9E75",
        backgroundColor: "rgba(29,158,117,0.08)",
        pointBackgroundColor: sorted.map((_, i) =>
          i === activeIdx ? "#0F6E56" : "#1D9E75"
        ),
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: sorted.map((_, i) => (i === activeIdx ? 8 : 4)),
        borderWidth: 2,
        fill: true,
        tension: 0.35,
      },
      {
        label: "Accuracy %",
        data: sorted.map(getAccuracy),
        yAxisID: "y2",
        borderColor: "#378ADD",
        backgroundColor: "transparent",
        pointBackgroundColor: sorted.map((_, i) =>
          i === activeIdx ? "#185FA5" : "#378ADD"
        ),
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: sorted.map((_, i) => (i === activeIdx ? 8 : 4)),
        borderWidth: 2,
        borderDash: [5, 4],
        fill: false,
        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#ffffff",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        titleColor: "rgba(0,0,0,0.5)",
        bodyColor: "rgba(0,0,0,0.85)",
        padding: 10,
        callbacks: {
          title: (items) => "Session " + items[0].label,
          label: (item) =>
            item.dataset.label + ": " + item.raw +
            (item.dataset.label === "Accuracy %" ? "%" : " wpm"),
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "rgba(0,0,0,0.4)", font: { size: 11 } },
        border: { color: "transparent" },
      },
      y: {
        position: "left",
        title: { display: true, text: "wpm", color: "rgba(0,0,0,0.4)", font: { size: 10 } },
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "rgba(0,0,0,0.4)", font: { size: 10 } },
        border: { color: "transparent" },
        min: 0,
      },
      y2: {
        position: "right",
        title: { display: true, text: "%", color: "rgba(0,0,0,0.4)", font: { size: 10 } },
        grid: { display: false },
        ticks: {
          color: "rgba(0,0,0,0.4)",
          font: { size: 10 },
          callback: (v) => v + "%",
        },
        border: { color: "transparent" },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[88vh] overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">My Typing History</h2>
                  <p className="text-xs text-gray-400 mt-0.5">All your submitted typing sessions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Stats strip */}
            {reports.length > 0 && (
              <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
                {[
                  { label: "Best WPM", value: bestWpm, color: "text-emerald-600" },
                  { label: "Avg WPM", value: avgWpm, color: "text-blue-600" },
                  { label: "Sessions", value: reports.length, color: "text-gray-800" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white border border-gray-100 rounded-lg px-3 py-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className={`text-lg font-semibold mt-0.5 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Split body */}
            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* Session list */}
              <div className="w-72 flex-shrink-0 border-r border-gray-100 overflow-y-auto px-4 py-4">
                {loading && reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative w-10 h-10 mb-3">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse" />
                      <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                    <p className="text-xs text-gray-400">Loading sessions...</p>
                  </div>
                ) : reports.length > 0 ? (
                  <>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
                      Recent sessions
                    </p>
                    <div className="space-y-1.5">
                      {[...reports].reverse().map((report, i) => {
                        const sessionNum = reports.length - i;
                        const sortedIdx = sessionNum - 1;
                        const a = getAccuracy(report);
                        const isActive = activeIdx === sortedIdx;
                        return (
                          <div
                            key={i}
                            onClick={() => setActiveIdx(sortedIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${
                              isActive
                                ? "border-blue-200 bg-blue-50"
                                : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium shrink-0 ${isActive ? "bg-white text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                                #{sessionNum}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-800">
                                  {new Date(report.submittedAt || Date.now()).toLocaleDateString("en-IN", {
                                    day: "2-digit", month: "short", year: "numeric",
                                  })}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {report.correct}c · {report.wrong}w
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${pillClass(a)}`}>
                                {a}%
                              </span>
                              <span className="text-xs font-medium text-emerald-600">
                                {report.wpm} <span className="text-[10px] text-gray-400 font-normal">wpm</span>
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">No Sessions Yet</h3>
                    <p className="text-xs text-gray-400">Complete typing sessions to see them here.</p>
                  </div>
                )}
              </div>

              {/* Chart pane */}
              <div className="flex-1 flex flex-col px-5 py-4 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Progress over sessions</span>
                  <div className="flex gap-3">
                    {[
                      { color: "bg-emerald-500", label: "WPM" },
                      { color: "bg-blue-500", label: "Accuracy %", dashed: true },
                    ].map(({ color, label, dashed }) => (
                      <span key={label} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <span className={`w-5 h-0.5 ${dashed ? "border-t-2 border-dashed border-blue-400 bg-transparent" : color + " rounded"}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 relative min-h-0">
                  {reports.length > 0 ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-400">No data to display yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <p className="text-xs text-gray-400">
                {reports.length > 0 ? `Showing ${reports.length} session${reports.length !== 1 ? "s" : ""}` : ""}
              </p>
              <div className="flex gap-2">
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="cursor-pointer py-2 px-4 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load more"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}