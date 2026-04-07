// src/components/admin/StudentReports.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showError } from "../../utils/toast";

export default function StudentReports() {
  const { studentId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, studentId]);

  const fetchReports = async (page) => {
    setLoading(true);
    const result = await api.getStudentTypingReports(studentId, page, pageSize);

    if (result.data?.success) {
      setReports(result.data.data || []);

      const paginationHeader = result.rawResponse.headers.get("x-pagination") || 
                              result.rawResponse.headers.get("X-Pagination");

      if (paginationHeader) {
        const metadata = JSON.parse(paginationHeader);
        setTotalPages(metadata.TotalPages || 1);
      }
    } else {
      showError("Failed to load student reports");
    }
    setLoading(false);
  };

  const columns = [
    { header: "Date", accessor: (row) => new Date(row.reportDate).toLocaleDateString('en-IN') },
    { header: "Activity", key: "activityName" },
    { header: "Speed (WPM)", key: "typingSpeed" },
    { header: "Accuracy (%)", key: "typingAccuracy" },
  ];

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">Student Typing Reports</h1>

      <DataTable
        columns={columns}
        data={reports}
        loading={loading}
        emptyMessage="No reports found for this student."
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-10">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}