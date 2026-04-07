import { motion, AnimatePresence } from "framer-motion";

export default function NoticeModal({ isOpen, onClose, notice, loading = false }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <p className="mt-6 text-gray-500">Loading full notice details...</p>
            </div>
          ) : notice ? (
            <>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-900">{notice.title}</h2>
                    <p className="text-blue-600 mt-2 font-medium">Notice For: {notice.for}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-3xl text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-8 text-sm text-gray-500 mb-8">
                  <div>
                    Start Date: <span className="font-medium text-gray-700">{new Date(notice.startDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div>
                    End Date: <span className="font-medium text-gray-700">{new Date(notice.endDate).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="prose text-gray-700 leading-relaxed text-[15.5px] whitespace-pre-wrap">
                  {notice.body}
                </div>
              </div>

              <div className="border-t bg-gray-50 px-8 py-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-10 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-2xl font-medium transition-all"
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