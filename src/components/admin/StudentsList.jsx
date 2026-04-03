// src/components/admin/StudentsList.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 10;
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page = 1) => {
    setLoading(true);

    try {
      const result = await api.getStudents(page, pageSize);

      if (result.data?.success) {
        setStudents(result.data.data || []);

        // Get X-Pagination header from raw response
        const paginationHeader = result.rawResponse.headers.get("x-pagination") ||
                                result.rawResponse.headers.get("X-Pagination");


        if (paginationHeader) {
          try {
            const metadata = JSON.parse(paginationHeader);

            setTotalPages(metadata.TotalPages || 1);
            setTotalCount(metadata.TotalCount || 0);
            setCurrentPage(metadata.CurrentPage || page);
          } catch (parseError) {

          }
        } else {
          setTotalPages(1);
          setTotalCount(result.data.data?.length || 0);
        }
      } else {
        showError(result.data?.message || result.data?.Message || "Failed to load students");
      }
    } catch (error) {
      showError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Student?",
      message: "This will move the student to the deleted list.",
      confirmText: "Yes, Delete",
      type: "danger"
    });

    if (!isConfirmed) return;

    const res = await api.softDeleteStudent(id);
    if (res.success) {
      showSuccess("Student moved to deleted list");
      fetchStudents(currentPage);
    } else {
      showError("Failed to delete student");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Filter only on client side (for search)
  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "—" },
    { header: "Semester", key: "currentSem" },
    { header: "Enrolled", accessor: (row) => new Date(row.enrolledDate).toLocaleDateString() },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin/students/edit/${row.id}`)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-2xl hover:bg-blue-700 cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded-2xl hover:bg-red-700 cursor-pointer"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">All Students</h1>
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-6 py-3 border border-gray-300 rounded-3xl w-80 focus:outline-none focus:border-blue-600 cursor-pointer"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
        actions={actions}
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
            className="px-5 py-2 border rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
          >
            Previous
          </button>

          <span className="px-6 py-2 border rounded-2xl bg-blue-50 text-blue-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2 border rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}