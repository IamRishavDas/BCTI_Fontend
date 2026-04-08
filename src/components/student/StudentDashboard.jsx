// src/components/student/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.32, delay: i * 0.07, ease: "easeOut" },
  }),
};

function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-14 bg-gray-200 rounded mb-2" />
      <div className="h-2.5 w-28 bg-gray-100 rounded" />
    </div>
  );
}

function StatCard({ label, value, sub, accent, delay }) {
  const accents = {
    blue:    { bg: "bg-blue-50",    num: "text-blue-700",    dot: "bg-blue-500" },
    emerald: { bg: "bg-emerald-50", num: "text-emerald-700", dot: "bg-emerald-500" },
    amber:   { bg: "bg-amber-50",   num: "text-amber-700",   dot: "bg-amber-400" },
  };
  const c = accents[accent] ?? accents.blue;

  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-1"
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold ${c.num}`}>{value}</span>
        {sub && <span className="text-sm text-gray-400 font-medium">{sub}</span>}
      </div>
    </motion.div>
  );
}

function ReportRow({ report, index }) {
  const speed    = report.typingSpeed;
  const accuracy = report.typingAccuracy;

  const speedTier =
    speed >= 60 ? { label: "Fast",   bg: "bg-emerald-50", text: "text-emerald-700" } :
    speed >= 35 ? { label: "Avg",    bg: "bg-amber-50",   text: "text-amber-700" } :
                  { label: "Slow",   bg: "bg-red-50",     text: "text-red-600" };

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 transition-all duration-150 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h6m-6 4h6M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/>
            <polyline points="14 3 14 8 19 8"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {new Date(report.reportDate).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{report.activityName}</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-base font-bold text-emerald-700 leading-none">{speed}</p>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">WPM</p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-amber-700 leading-none">{accuracy}%</p>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Accuracy</p>
        </div>
        <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${speedTier.bg} ${speedTier.text}`}>
          {speedTier.label}
        </span>
      </div>
    </motion.div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12h6m-6 4h6M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/>
          <polyline points="14 3 14 8 19 8"/>
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">No reports yet</p>
      <p className="text-xs text-gray-400 mb-5">Submit your first session to start tracking progress</p>
      <button
        onClick={onAction}
        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
      >
        Submit first report
      </button>
    </div>
  );
}

export default function StudentDashboard() {
  const [myReports,    setMyReports]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [totalReports, setTotalReports] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { fetchMyReports(); }, []);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const result = await api.getMyReports(1, 4);
      if (result.data?.success) {
        setMyReports(result.data.data || []);
        setTotalReports(result.data.data?.length || 0);
      } else {
        showError(result.data?.message || "Failed to load your reports");
      }
    } catch {
      showError("Unable to load your reports");
    } finally {
      setLoading(false);
    }
  };

  const latest = myReports[0] ?? null;

  return (
    <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
          className="flex items-start justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-1 text-sm">Track your progress at BCTI</p>
          </div>
          <button
            onClick={() => navigate("/student/report")}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New report
          </button>
        </motion.div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Reports"   value={totalReports}              accent="blue"    delay={0} />
            <StatCard label="Latest Speed"    value={latest?.typingSpeed   ?? "—"} sub={latest ? "WPM" : ""} accent="emerald" delay={1} />
            <StatCard label="Latest Accuracy" value={latest ? `${latest.typingAccuracy}%` : "—"} accent="amber" delay={2} />
          </div>
        )}

        {/* Recent Reports */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Recent sessions</p>
              <p className="text-xs text-gray-400 mt-0.5">Your latest typing activities</p>
            </div>
            {!loading && myReports.length > 0 && (
              <button
                onClick={() => navigate("/student/my-reports")}
                className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View all
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            )}
          </div>

          <div className="p-4 space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
                <p className="text-xs text-gray-400">Loading sessions…</p>
              </div>
            ) : myReports.length > 0 ? (
              myReports.slice(0, 5).map((report, i) => (
                <ReportRow key={i} report={report} index={i} />
              ))
            ) : (
              <EmptyState onAction={() => navigate("/student/report")} />
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}