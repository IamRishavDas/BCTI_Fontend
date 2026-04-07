// src/components/student/MyReports.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import DataTable from "../common/DataTable";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchMyReports(currentPage);
  }, [currentPage]);

  const fetchMyReports = async (page = 1) => {
    setLoading(true);

    try {
      const result = await api.getMyReports(page, pageSize);

      if (result.data?.success) {
        setReports(result.data.data || []);

        // Read X-Pagination header
        const paginationHeader = result.rawResponse.headers.get("x-pagination") ||
                                result.rawResponse.headers.get("X-Pagination");

        if (paginationHeader) {
          try {
            const metadata = JSON.parse(paginationHeader);
            setTotalPages(metadata.TotalPages || 1);
            setTotalCount(metadata.TotalCount || 0);
            setCurrentPage(metadata.CurrentPage || page);
          } catch (e) {
            console.error("Failed to parse pagination header", e);
          }
        } else {
          setTotalPages(1);
          setTotalCount(result.data.data?.length || 0);
        }
      } else {
        showError(result.data?.message || "Failed to load your reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      showError("Unable to load your reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const columns = [
    { header: "Date", accessor: (row) => new Date(row.reportDate).toLocaleDateString('en-IN') },
    { header: "Activity", key: "activityName" },
    { header: "Speed (WPM)", key: "typingSpeed" },
    { header: "Accuracy (%)", key: "typingAccuracy" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">My Typing Reports</h1>

      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        emptyMessage="You haven't submitted any reports yet."
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-4">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} reports
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2 border rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            <span className="px-6 py-2 border rounded-2xl bg-blue-50 text-blue-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2 border rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}