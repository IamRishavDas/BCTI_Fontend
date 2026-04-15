// src/components/admin/StudentsList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import StudentReportsModal from "./StudentReportsModal"; 
import StudentScheduleModal from "./StudentScheduleModal";
import StudentInfoModal from "./StudentInfoModal";   
import StudentPDFModal from "./StudentPDFModal";

import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClockIcon, 
  EditIcon, 
  PlusIcon, 
  ReportsIcon, 
  TrashIcon,
  EyeIcon,   
  SearchIconL,
  DownloadIcon
} from "../../static/Svg";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);     
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

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
          result.rawResponse?.headers.get("x-pagination") || 
          result.rawResponse?.headers.get("X-Pagination");

        if (paginationHeader) {
          try {
            const metadata = JSON.parse(paginationHeader);
            setTotalPages(metadata.TotalPages || 1);
            setTotalCount(metadata.TotalCount || 0);
            setCurrentPage(metadata.CurrentPage || page);
          } catch (e) {}
        } else {
          setTotalPages(1);
          setTotalCount(result.data.data?.length || 0);
        }
      } else {
        showError(result.data?.message || "Failed to load students");
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

  const handleOpenPDF = (row) => {
    setSelectedStudent(row);
    setIsPDFModalOpen(true);
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
    {
      header: "Enrolled",
      accessor: (row) => new Date(row.enrolledDate).toLocaleDateString("en-IN"),
    },
  ];

  const actions = (row) => (
    <div className="flex gap-1.5">
      {/* Eye - View Full Info */}
      <button
        onClick={() => {
          setSelectedStudent(row);
          setIsInfoModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
        title="View Full Information"
      >
        <EyeIcon/>
      </button>

      <button
        onClick={() => handleOpenPDF(row)}
        className="px-3 py-1.5 text-xs font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
        title="View PDF"
      >
        <DownloadIcon />
      </button>

      {/* Reports */}
      <button
        onClick={() => {
          setSelectedStudent(row);
          setIsReportsModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
        title="View Reports"
      >
        <ReportsIcon />
      </button>

      {/* Schedule */}
      <button
        onClick={() => {
          setSelectedStudent(row);
          setIsScheduleModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
        title="Manage Schedule"
      >
        <ClockIcon />
      </button>

      {/* Edit */}
      <button
        onClick={() => navigate(`/admin/students/edit/${row.id}`)}
        className="px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
        title="Edit Student"
      >
        <EditIcon />
      </button>

      {/* Delete */}
      <button
        onClick={() => handleDelete(row.id)}
        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        title="Delete Student"
      >
        <TrashIcon />
      </button>
    </div>
  );

  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="space-y-6">
      {/* Header - unchanged */}
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
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIconL />
            </span>
            <input
              type="text"
              placeholder="Search by name or roll no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-2xl w-72 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

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

      {/* Pagination - unchanged */}
      {!loading && totalCount > 0 && (
        <motion.div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-gray-700">{rangeStart}–{rangeEnd}</span> of{" "}
            <span className="font-medium text-gray-700">{totalCount}</span> students
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeftIcon />
            </button>

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
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-40 cursor-pointer"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <StudentReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        student={selectedStudent}
      />

      <StudentScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        student={selectedStudent}
      />

      <StudentInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        student={selectedStudent}
      />

      <StudentPDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}