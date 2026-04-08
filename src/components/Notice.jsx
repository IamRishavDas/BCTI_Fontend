import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import NoticeModal from "./common/NoticeModal";
import { showError } from "../utils/toast";

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.getNotices();
      if (res.success) {
        setNotices(res.data || []);
      }
    } catch (error) {
      // console.error("Failed to fetch notices:", error);
      showError("Failed to face notices");
    }
  };

  const openNotice = async (noticeSummary) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const res = await api.getNoticeById(noticeSummary.id);
      if (res.success && res.data) {
        setSelectedNotice(res.data);
      } else {
        setSelectedNotice(noticeSummary);
      }
    } catch (error) {
      // console.error("Failed to load full notice:", error);
      showError("Failed to load full notices");
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
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="md:col-span-5"
      >
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 px-7 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center text-lg">
                📢
              </div>
              <h2 className="text-[17px] font-semibold text-white tracking-tight">
                Latest Notices
              </h2>
            </div>
            <span className="text-[11px] font-medium bg-white/15 border border-white/20 text-white px-3 py-1 rounded-full">
              Updated Today
            </span>
          </div>

          {/* Notice List */}
          <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {notices.length > 0 ? (
              notices.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openNotice(notice)}
                  className="px-6 py-1.5 cursor-pointer transition-colors hover:bg-blue-50/70 group relative"
                >
                  {/* Audience tag */}
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 py-0.5 rounded-md mb-0.5">
                    For: {notice.for}
                  </span>

                  {/* Title */}
                  <h3 className="text-[14.5px] font-semibold text-gray-900 leading-snug pr-6 group-hover:text-blue-700 transition-colors">
                    {notice.title}
                  </h3>

                  {/* Body preview */}
                  <p className="text-[13px] text-gray-500 leading-relaxed mt-2 line-clamp-2">
                    {notice.body}
                  </p>

                  {/* Date range */}
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDate(notice.startDate)} — {formatDate(notice.endDate)}
                  </p>

                  {/* Chevron */}
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all">
                    ›
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="py-16 text-center text-gray-400 text-sm">
                No active notices at the moment
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notice={selectedNotice}
        loading={modalLoading}
      />
    </>
  );
}