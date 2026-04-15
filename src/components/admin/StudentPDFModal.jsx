// src/components/admin/StudentPDFModal.jsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import { DownloadIcon } from "../../static/Svg";

export default function StudentPDFModal({ isOpen, onClose, student }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !student) return;

    const loadPDF = async () => {
      setLoading(true);
      try {
        const res = await api.getStudentPersonalInfoPDF(student.id);
        if (!res.ok) {
          showError("Failed to load PDF");
          return;
        }
        const url = URL.createObjectURL(res.data);
        objectUrlRef.current = url;
        setPdfUrl(url);
      } catch {
        showError("Error loading PDF");
      } finally {
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
        setPdfUrl(null);
      }
    };
  }, [isOpen, student]);

  const handleDownload = () => {
    if (!pdfUrl || !student) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${student.firstName}_${student.lastName}_info.pdf`;
    a.click();
  };

  const handleClose = () => {
    setPdfUrl(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden"
            style={{ width: "min(860px, 95vw)", height: "min(90vh, 880px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Student Information
                </h2>
                {student && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    {student.firstName} {student.lastName} &middot; {student.rollNo}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Download button */}
                <button
                  onClick={handleDownload}
                  disabled={!pdfUrl}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <DownloadIcon />
                  Download PDF
                </button>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-9 h-9 text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden bg-gray-50">
              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
                  <p className="text-sm">Loading PDF…</p>
                </div>
              )}

              {!loading && pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="Student Information PDF"
                  className="w-full h-full"
                  style={{ border: "none" }}
                />
              )}

              {!loading && !pdfUrl && (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                  Unable to load PDF.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}