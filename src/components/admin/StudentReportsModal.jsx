// src/components/admin/StudentReportsModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import DataTable from "../common/DataTable";

export default function StudentReportsModal({ isOpen, onClose, student }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    if (isOpen && student?.id) {
      fetchReports(1);
    }
  }, [isOpen, student]);

  const fetchReports = async (page) => {
    setLoading(true);
    try {
      const result = await api.getStudentTypingReports(student.id, page, pageSize);

      if (result.data?.success) {
        setReports(result.data.data || []);

        const paginationHeader = result.rawResponse?.headers.get("x-pagination") ||
                                result.rawResponse?.headers.get("X-Pagination");

        if (paginationHeader) {
          try {
            const metadata = JSON.parse(paginationHeader);
            setTotalPages(metadata.TotalPages || 1);
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (error) {
      showError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchReports(newPage);
  };

  if (!student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[120] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-semibold">
                  {student.firstName} {student.lastName} Reports
                </h2>
                <p className="text-gray-500">Roll No: {student.rollNo}</p>
              </div>
              <button
                onClick={onClose}
                className="text-3xl text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Reports Table */}
            <div className="flex-1 overflow-auto p-8">
              <DataTable
                columns={[
                  { header: "Date", accessor: (row) => new Date(row.reportDate).toLocaleDateString('en-IN') },
                  { header: "Activity", key: "activityName" },
                  { header: "Speed (WPM)", key: "typingSpeed" },
                  { header: "Accuracy (%)", key: "typingAccuracy" },
                ]}
                data={reports}
                loading={loading}
                emptyMessage="No reports found for this student."
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t p-6 flex justify-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-3 border rounded-2xl disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-8 py-3 border rounded-2xl bg-blue-50">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 border rounded-2xl disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}