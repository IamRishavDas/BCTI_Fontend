// src/components/admin/StudentsList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#9ca3af" }}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

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
        const paginationHeader =
          result.rawResponse.headers.get("x-pagination") ||
          result.rawResponse.headers.get("X-Pagination");
        if (paginationHeader) {
          try {
            const metadata = JSON.parse(paginationHeader);
            setTotalPages(metadata.TotalPages || 1);
            setTotalCount(metadata.TotalCount || 0);
            setCurrentPage(metadata.CurrentPage || page);
          } catch {}
        } else {
          setTotalPages(1);
          setTotalCount(result.data.data?.length || 0);
        }
      } else {
        showError(result.data?.message || result.data?.Message || "Failed to load students");
      }
    } catch {
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
      type: "danger",
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

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "—" },
    { header: "Semester", key: "currentSem" },
    { header: "Enrolled", accessor: (row) => new Date(row.enrolledDate).toLocaleDateString("en-IN") },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin/students/edit/${row.id}`)}
        className="px-4 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="px-4 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
      >
        Delete
      </button>
    </div>
  );

  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">All Students</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {totalCount} student{totalCount !== 1 ? "s" : ""} enrolled
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search by name or roll no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-2xl w-72 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Add button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/admin/students/new")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors cursor-pointer"
          >
            <PlusIcon />
            Add Student
          </motion.button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow overflow-hidden"
      >
        <DataTable
          columns={columns}
          data={filteredStudents}
          loading={loading}
          actions={actions}
        />
      </motion.div>

      {/* Pagination */}
      {!loading && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between px-1"
        >
          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-700">{rangeStart}–{rangeEnd}</span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">{totalCount}</span> students
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeftIcon />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 text-sm rounded-xl font-medium transition-colors cursor-pointer ${
                        p === currentPage
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}