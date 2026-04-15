// src/components/admin/StudentSearch.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showError, showSuccess } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import StudentReportsModal from "./StudentReportsModal";
import StudentScheduleModal from "./StudentScheduleModal";
import StudentInfoModal from "./StudentInfoModal";  

import { ClockIcon, DownloadIcon, EditIcon, EyeIcon, ReportsIcon, TrashIcon } from "../../static/Svg";

export default function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);     // ← New
  const [selectedStudent, setSelectedStudent] = useState(null);

  const navigate = useNavigate();
  const { confirm } = useConfirm();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      performSearch(debouncedSearchTerm);
    } else if (debouncedSearchTerm === "") {
      setStudents([]);
    }
  }, [debouncedSearchTerm]);

  const performSearch = async (term) => {
    setLoading(true);
    try {
      const result = await api.searchStudents(term, 1, 10);
      if (result.data?.success) {
        setStudents(result.data.data || []);
      } else {
        setStudents([]);
        if (result.data?.message || result.data?.Message) {
          showError(result.data.message || result.data.Message);
        }
      }
    } catch {
      showError("Search failed. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (studentId) => {
    try {
      const res = await api.getStudentPersonalInfoPDF(studentId);

      if (!res.ok) {
        showError("Failed to download PDF");
        return;
      }

      const url = window.URL.createObjectURL(res.data);
      window.open(url, "_blank");
    } catch {
      showError("Error downloading PDF");
    }
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarColors = [
    { bg: "#E6F1FB", color: "#185FA5" },
    { bg: "#FBEAF0", color: "#993556" },
    { bg: "#E1F5EE", color: "#0F6E56" },
    { bg: "#EEEDFE", color: "#534AB7" },
    { bg: "#FAEEDA", color: "#854F0B" },
  ];

  const getAvatarColor = (id) => {
    const safeId = Number(id) || 0;
    const index = Math.abs(safeId) % avatarColors.length;
    return avatarColors[index];
  };

  const handleDelete = async (row) => {
    const isConfirmed = await confirm({
      title: "Delete Student?",
      message: "This will move the student to the deleted list.",
      confirmText: "Yes, Delete",
      type: "danger",
    });

    if (!isConfirmed) return;

    const res = await api.softDeleteStudent(row.id);
    if (res.success) {
      showSuccess("Student moved to deleted list");
      performSearch(debouncedSearchTerm);
    } else {
      showError("Failed to delete student");
    }
  };

  const columns = [
    {
      header: "Roll No",
      accessor: (row) => (
        <span className="font-mono text-xs text-gray-400">{row.rollNo}</span>
      ),
    },
    {
      header: "Student",
      accessor: (row) => {
        const { bg, color } = getAvatarColor(row.id ?? 0);
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
              style={{ background: bg, color }}
            >
              {getInitials(row.firstName, row.lastName)}
            </div>
            <span className="font-medium text-sm">
              {row.firstName} {row.lastName}
            </span>
          </div>
        );
      },
    },
    {
      header: "Course",
      accessor: (row) => (
        <span className="text-sm text-gray-600">
          {row.course?.courseName ?? "—"}
        </span>
      ),
    },
    {
      header: "Semester",
      accessor: (row) => (
        <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700">
          Sem {row.currentSem}
        </span>
      ),
    },
  ];

  // Actions - Added Eye button at the beginning
  const actions = (row) => (
    <div className="flex gap-1.5">
      {/* Eye Button - View Full Info */}
      <button
        onClick={() => {
          setSelectedStudent(row);
          setInfoModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
        title="View Full Information"
      >
        <EyeIcon/>
      </button>

      <button
        onClick={() => handleDownloadPDF(row.id)}
        className="px-3 py-1.5 text-xs font-medium text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
        title="Download PDF"
      >
        <DownloadIcon/>
      </button>

      {/* Reports Button */}
      <button
        onClick={() => {
          setSelectedStudent(row);
          setReportsModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-medium text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
        title="View Reports"
      >
        <ReportsIcon/>
      </button>

      {/* Schedule Button */}
      <button
        onClick={() => {
          setSelectedStudent(row);
          setScheduleModalOpen(true);
        }}
        className="px-3 py-1.5 text-xs font-medium text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
        title="Manage Schedule"
      >
        <ClockIcon/>
      </button>

      {/* Edit Button */}
      <button
        onClick={() => navigate(`/admin/students/edit/${row.id}`)}
        className="px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
        title="Edit Student"
      >
        <EditIcon/>
      </button>

      {/* Delete Button */}
      <button
        onClick={() => handleDelete(row)}
        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        title="Delete Student"
      >
        <TrashIcon/>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header - unchanged */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Search students</h1>
        <p className="text-sm text-gray-400 mt-1">
          Find students by roll number or name
        </p>
      </div>

      {/* Search input - unchanged */}
      <div className="space-y-1.5">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m15 15 3 3" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by roll no or student name…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                       placeholder:text-gray-400 transition-all"
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-blue-500 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 pl-1">
          Type at least 2 characters · Results update automatically
        </p>
      </div>

      {/* Results - unchanged */}
      {debouncedSearchTerm && (
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              Results for "{debouncedSearchTerm}"
            </span>
            {!loading && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                {students.length} found
              </span>
            )}
          </div>

          <DataTable
            columns={columns}
            data={students}
            loading={loading}
            actions={actions}
            emptyMessage="No students found matching your search."
          />
        </div>
      )}

      {/* Modals */}
      <StudentReportsModal
        isOpen={reportsModalOpen}
        onClose={() => setReportsModalOpen(false)}
        student={selectedStudent}
      />

      <StudentScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        student={selectedStudent}
      />

      <StudentInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}