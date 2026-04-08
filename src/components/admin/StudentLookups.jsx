import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showError } from "../../utils/toast";

export default function StudentLookups() {
  const [lookups, setLookups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 10;   // Slightly more for lookups

  useEffect(() => {
    fetchLookups(currentPage);
  }, [currentPage]);

  const fetchLookups = async (page = 1) => {
    setLoading(true);

    try {
      const result = await api.getStudentLookups(page, pageSize, false); 

      if (result.data?.success) {
        setLookups(result.data.data || []);

        const paginationHeader = result.rawResponse.headers.get("x-pagination") ||
                                result.rawResponse.headers.get("X-Pagination");

        if (paginationHeader) {
          try {
            const metadata = JSON.parse(paginationHeader);
            setTotalPages(metadata.TotalPages || 1);
            setTotalCount(metadata.TotalCount || 0);
            setCurrentPage(metadata.CurrentPage || page);
          } catch (e) {
            // console.error("Failed to parse pagination header", e);
            showError("Failed to parse pagination error");
          }
        } else {
          setTotalPages(1);
          setTotalCount(result.data.data?.length || 0);
        }
      } else {
        showError(result.data?.message || result.data?.Message || "Failed to load student lookups");
      }
    } catch (error) {
      // console.error("Error fetching lookups:", error);
      showError("Error fetching lookups");
      showError("Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Student Name", key: "name" },
    { header: "Current Semester", key: "currentSem" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">Student Lookups</h1>
        <p className="text-gray-500">Active Students List (Paginated)</p>
      </div>

      <DataTable
        columns={columns}
        data={lookups}
        loading={loading}
        // No actions needed for lookups
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-8 px-4">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} students
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2 border rounded-2xl disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>

          <span className="px-6 py-2 border rounded-2xl bg-blue-50 text-blue-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2 border rounded-2xl disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}