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
  const [summary, setSummary] = useState(null);   // ← Now using real summary

  const pageSize = 8;

  useEffect(() => {
    if (isOpen && student?.id) {
      setCurrentPage(1);
      fetchAllData(1);
    }
  }, [isOpen, student]);

  const fetchAllData = async (page) => {
    setLoading(true);
    try {
      // Fetch both reports + summary in parallel
      const [reportsRes, summaryRes] = await Promise.all([
        api.getStudentTypingReports(student.id, page, pageSize),
        api.getStudentSummary(student.id)
      ]);

      if (reportsRes.data?.success) {
        setReports(reportsRes.data.data || []);

        const paginationHeader =
          reportsRes.rawResponse?.headers.get("x-pagination") ||
          reportsRes.rawResponse?.headers.get("X-Pagination");

        if (paginationHeader) {
          try {
            const meta = JSON.parse(paginationHeader);
            setTotalPages(meta.TotalPages || 1);
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      showError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchAllData(newPage);   // Re-fetch reports for new page
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  if (!student) return null;

  const columns = [
    {
      header: "Date",
      accessor: (row) =>
        new Date(row.reportDate).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        }),
    },
    { header: "Activity", key: "activityName" },
    { header: "Description", key: "activityDescription" },
    {
      header: "Speed (WPM)",
      accessor: (row) => (
        <span className="font-medium text-blue-600">{row.typingSpeed}</span>
      ),
    },
    {
      header: "Accuracy (%)",
      accessor: (row) => {
        const val = row.typingAccuracy;
        const color = val >= 90 ? "text-green-600" : val >= 75 ? "text-amber-600" : "text-red-500";
        return <span className={`font-medium ${color}`}>{val}</span>;
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[88vh] overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-700 shrink-0">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Roll no: {student.rollNo}
                    {student.course?.courseName && ` · ${student.course.courseName}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Stats bar - Now using real summary from API */}
            {!loading && summary && (
              <div className="grid grid-cols-3 gap-3 px-6 py-3 border-b border-gray-100 bg-white shrink-0">
                <div className="bg-gray-50 rounded-lg px-4 py-2.5">
                  <p className="text-xs text-gray-400">Avg speed</p>
                  <p className="text-lg font-semibold text-blue-600 mt-0.5">
                    {Math.round(summary.avgTypingSpeed || 0)} 
                    <span className="text-xs font-normal text-gray-400"> WPM</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-2.5">
                  <p className="text-xs text-gray-400">Avg accuracy</p>
                  <p className="text-lg font-semibold text-green-600 mt-0.5">
                    {Math.round(summary.avgTypingAccuracy || 0)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-2.5">
                  <p className="text-xs text-gray-400">Total sessions</p>
                  <p className="text-lg font-semibold text-gray-700 mt-0.5">
                    {summary.sessions || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <DataTable
                columns={columns}
                data={reports}
                loading={loading}
                emptyMessage="No reports found for this student."
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white shrink-0">
                <span className="text-xs text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="cursor-pointer px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    ← Prev
                  </button>
                  {getPageNumbers().map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-7 h-7 text-xs rounded-lg transition-colors cursor-pointer ${
                        p === currentPage
                          ? "bg-blue-600 text-white border border-blue-600"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}