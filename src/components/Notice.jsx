// src/components/Notice.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import NoticeModal from "./common/NoticeModal";

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
      console.error("Failed to fetch notices:", error);
    }
  };

  // When user clicks on a notice → fetch full details
  const openNotice = async (noticeSummary) => {
    setModalLoading(true);
    setIsModalOpen(true);

    try {
      const res = await api.getNoticeById(noticeSummary.id);
      if (res.success && res.data) {
        setSelectedNotice(res.data);
      } else {
        setSelectedNotice(noticeSummary); // fallback
      }
    } catch (error) {
      console.error("Failed to load full notice:", error);
      setSelectedNotice(noticeSummary); // fallback to summary
    } finally {
      setModalLoading(false);
    }
  };

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
          <div className="bg-blue-700 text-white px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-xl">📢</div>
              <h2 className="text-2xl font-semibold tracking-tight">Latest Notices</h2>
            </div>
            <span className="text-sm bg-white/20 px-4 py-1 rounded-full">Updated Today</span>
          </div>

          {/* Notice List */}
          <div className="divide-y divide-gray-100 max-h-[520px] overflow-y-auto">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <motion.div
                  key={notice.id}
                  whileHover={{ backgroundColor: "#f0f9ff" }}
                  onClick={() => openNotice(notice)}
                  className="px-8 py-7 hover:bg-blue-50/70 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight pr-4">
                      {notice.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(notice.startDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Notice For: <span className="font-medium">{notice.for}</span>
                  </p>

                  <div className="text-xs text-gray-400 mt-3">
                    {new Date(notice.startDate).toLocaleDateString('en-IN')} — {new Date(notice.endDate).toLocaleDateString('en-IN')}
                  </div>

                  <p className="text-gray-600 text-[15px] leading-relaxed mt-3 line-clamp-2">
                    {notice.body}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400">No active notices at the moment</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Full Notice Detail Modal */}
      <NoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notice={selectedNotice}
        loading={modalLoading}
      />
    </>
  );
}