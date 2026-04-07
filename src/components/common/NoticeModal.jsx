import { motion, AnimatePresence } from "framer-motion";

export default function NoticeModal({ isOpen, onClose, notice, loading = false }) {
  if (!isOpen) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-9 h-9 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Loading notice details...</p>
            </div>
          ) : notice ? (
            <>
              {/* Gradient Header */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-500 px-7 py-6 relative">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Notice for {notice.for}
                </p>
                <h2 className="text-xl font-semibold text-white leading-snug pr-10">
                  {notice.title}
                </h2>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="cursor-pointer absolute top-5 right-5 w-8 h-8 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg flex items-center justify-center text-white text-sm transition-colors"
                >
                  ✕
                </button>

                {/* Date pills */}
                <div className="flex mt-5 bg-white/10 border border-white/20 rounded-xl overflow-hidden">
                  <div className="flex-1 px-4 py-2.5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/50 mb-0.5">
                      Effective from
                    </p>
                    <p className="text-[13px] font-semibold text-white">
                      {formatDate(notice.startDate)}
                    </p>
                  </div>
                  <div className="flex-1 px-4 py-2.5 border-l border-white/20">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/50 mb-0.5">
                      Valid until
                    </p>
                    <p className="text-[13px] font-semibold text-white">
                      {formatDate(notice.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {notice.body}
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 bg-gray-50/60 px-7 py-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 bg-gray-900 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}