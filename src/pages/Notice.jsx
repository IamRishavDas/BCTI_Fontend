import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import NoticeModal from "../components/common/NoticeModal";
import { showError } from "../utils/toast";
import { BellIcon, CalendarIcon, ChevronRight } from "../static/Svg";

const ACCENT_MAP = {
  Students: { bar: "#7F77DD", tag: { bg: "#EEEDFE", color: "#3C3489" } },
  Staff:    { bar: "#639922", tag: { bg: "#EAF3DE", color: "#27500A" } },
  All:      { bar: "#378ADD", tag: { bg: "#E6F1FB", color: "#0C447C" } },
  Admin:    { bar: "#BA7517", tag: { bg: "#FAEEDA", color: "#633806" } },
};

function getAccent(forStr = "") {
  const key = Object.keys(ACCENT_MAP).find(
    (k) => forStr.toLowerCase().includes(k.toLowerCase())
  );
  return ACCENT_MAP[key] || ACCENT_MAP["All"];
}


export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.getNotices();
      if (res.success) setNotices(res.data || []);
    } catch {
      showError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const openNotice = async (noticeSummary) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const res = await api.getNoticeById(noticeSummary.id);
      setSelectedNotice(res.success && res.data ? res.data : noticeSummary);
    } catch {
      showError("Failed to load full notice");
      setSelectedNotice(noticeSummary);
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-full px-3.5 py-1.5 mb-4">
              <BellIcon />
              Stay Informed
            </div>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  Notices
                </h1>
                <p className="text-gray-500 mt-2 text-[15px]">
                  Important announcements and updates from BCTI
                </p>
              </div>
              {!loading && (
                <span className="text-sm font-medium text-gray-400 border border-gray-200 rounded-full px-4 py-1.5 bg-white">
                  {notices.length} active notice{notices.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </motion.div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-5 h-44 animate-pulse"
                >
                  <div className="h-3 w-20 bg-gray-100 rounded-full mb-4" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded-full mb-2" />
                  <div className="h-3 w-full bg-gray-100 rounded-full mb-1.5" />
                  <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Notice Grid */}
          {!loading && notices.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {notices.map((notice, i) => {
                  const accent = getAccent(notice.for);
                  return (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      onClick={() => openNotice(notice)}
                      className="group relative bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer overflow-hidden
                                 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                    >
                      {/* Left accent bar */}
                      <div
                        className="absolute top-0 left-0 w-[3px] h-full rounded-l-2xl"
                        style={{ background: accent.bar }}
                      />

                      {/* Audience tag */}
                      <span
                        className="inline-block text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3"
                        style={{
                          background: accent.tag.bg,
                          color: accent.tag.color,
                        }}
                      >
                        {notice.for}
                      </span>

                      {/* Title */}
                      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug mb-2.5 pr-5 group-hover:text-blue-700 transition-colors duration-150">
                        {notice.title}
                      </h3>

                      {/* Body preview */}
                      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {notice.body}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <CalendarIcon />
                          <span className="text-[11.5px] font-medium">
                            {formatDate(notice.startDate)} — {formatDate(notice.endDate)}
                          </span>
                        </div>

                        {/* Arrow */}
                        <span className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-150">
                          <ChevronRight />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && notices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No active notices at the moment</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
            </motion.div>
          )}

          {/* Footer hint */}
          {!loading && notices.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-gray-400 mt-10"
            >
              Click any notice to view full details
            </motion.p>
          )}
        </div>
      </section>

      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notice={selectedNotice}
        loading={modalLoading}
      />
    </>
  );
}