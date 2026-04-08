// src/components/student/MyReports.jsx
import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import DataTable from "../common/DataTable";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" },
  }),
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
      <div className="h-8 w-16 bg-gray-200 rounded" />
    </div>
  );
}

function StatCard({ label, value, sub, color, delay }) {
  const colorMap = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   bar: "bg-blue-500" },
    emerald:{ bg: "bg-emerald-50",text: "text-emerald-600",bar: "bg-emerald-500" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-600",  bar: "bg-amber-400" },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl p-5 border border-gray-100 bg-white flex flex-col gap-1`}
    >
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`text-3xl font-bold ${c.text}`}>{value}</span>
        {sub && <span className="text-sm text-gray-400 font-medium">{sub}</span>}
      </div>
    </motion.div>
  );
}

function AccuracyBar({ value }) {
  const color =
    value >= 90 ? "from-emerald-400 to-green-500" :
    value >= 70 ? "from-amber-400 to-yellow-500" :
    "from-red-400 to-rose-500";

  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <span className={`text-base font-bold ${
        value >= 90 ? "text-emerald-600" : value >= 70 ? "text-amber-600" : "text-red-500"
      }`}>{value}%</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className={`bg-gradient-to-r ${color} h-full rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function SpeedBadge({ value }) {
  const tier =
    value >= 60 ? { label: "Fast",   bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" } :
    value >= 35 ? { label: "Avg",    bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400" } :
    { label: "Slow", bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400" };

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-gray-800">{value}</span>
      <span className="text-xs text-gray-400 font-medium">WPM</span>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tier.bg} ${tier.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
        {tier.label}
      </span>
    </div>
  );
}

function PageButton({ onClick, disabled, children, active }) {
  if (active) {
    return (
      <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm">
        {children}
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >
      {children}
    </button>
  );
}

function Pagination({ currentPage, totalPages, totalCount, pageSize, onPageChange }) {
  const pages = useMemo(() => {
    const range = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  }, [currentPage, totalPages]);

  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-800">{from}–{to}</span> of{" "}
        <span className="font-semibold text-gray-800">{totalCount}</span> entries
      </p>
      <div className="flex items-center gap-1.5">
        <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          ‹
        </PageButton>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-9 text-center text-gray-400 text-sm">…</span>
          ) : (
            <PageButton
              key={p}
              onClick={() => onPageChange(p)}
              disabled={false}
              active={p === currentPage}
            >
              {p}
            </PageButton>
          )
        )}
        <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          ›
        </PageButton>
      </div>
    </div>
  );
}

export default function MyReports() {
  const [reports,     setReports]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalCount,  setTotalCount]  = useState(0);

  const pageSize = 10;

  useEffect(() => { fetchMyReports(currentPage); }, [currentPage]);

  const fetchMyReports = async (page = 1) => {
    setLoading(true);
    try {
      const result = await api.getMyReports(page, pageSize);
      if (result.data?.success) {
        setReports(result.data.data || []);
        const raw =
          result.rawResponse.headers.get("x-pagination") ||
          result.rawResponse.headers.get("X-Pagination");
        if (raw) {
          try {
            const m = JSON.parse(raw);
            setTotalPages(m.TotalPages   || 1);
            setTotalCount(m.TotalCount   || 0);
            setCurrentPage(m.CurrentPage || page);
          } catch { showError("Failed to parse pagination header"); }
        } else {
          setTotalPages(1);
          setTotalCount(result.data.data?.length || 0);
        }
      } else {
        showError(result.data?.message || "Failed to load your reports");
      }
    } catch {
      showError("Unable to load your reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const avgSpeed    = reports.length
    ? Math.round(reports.reduce((s, r) => s + r.typingSpeed, 0)    / reports.length)
    : null;
  const avgAccuracy = reports.length
    ? Math.round(reports.reduce((s, r) => s + r.typingAccuracy, 0) / reports.length)
    : null;

  const columns = [
    {
      header: "Date",
      accessor: (row) =>
        new Date(row.reportDate).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
      cellClassName: "text-sm font-semibold text-gray-700 whitespace-nowrap",
    },
    {
      header: "Activity",
      key: "activityName",
      cellClassName: "font-medium text-gray-900",
    },
    {
      header: "Description",
      key: "activityDescription",
      cellClassName: "text-sm text-gray-500 max-w-[220px] truncate",
    },
    {
      header: "Speed",
      accessor: (row) => <SpeedBadge value={row.typingSpeed} />,
    },
    {
      header: "Accuracy",
      accessor: (row) => <AccuracyBar value={row.typingAccuracy} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                My Typing Reports
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Track your speed and accuracy over time
              </p>
            </div>

            {!loading && totalCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {totalCount} sessions recorded
              </span>
            )}
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <AnimatePresence>
          {!loading && totalCount > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Reports" value={totalCount}    color="blue"    delay={0} />
              {avgSpeed    !== null && <StatCard label="Avg Speed"    value={avgSpeed}    sub="WPM" color="emerald" delay={1} />}
              {avgAccuracy !== null && <StatCard label="Avg Accuracy" value={`${avgAccuracy}%`}    color="amber"   delay={2} />}
            </div>
          )}
        </AnimatePresence>

        {/* ── Skeleton stat cards while loading ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        )}

        {/* ── Table Card ── */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          {/* Table header bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Session history</span>
            {!loading && (
              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          <div className="px-2">
            <DataTable
              columns={columns}
              data={reports}
              loading={loading}
              emptyMessage="No reports yet — complete a typing session to get started."
            />
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-6 pb-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}