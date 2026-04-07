// src/components/admin/StudentSearch.jsx
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showError } from "../../utils/toast";
import StudentReportsModal from "./StudentReportsModal";
import { ReportsIcon } from "../../static/Svg";

export default function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
        if (result.data?.message) showError(result.data.message);
      }
    } catch {
      showError("Search failed. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
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
    const safeId = Number(id);
    const index = isNaN(safeId)
      ? 0
      : Math.abs(safeId) % avatarColors.length;

    return avatarColors[index];
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

  const actions = (row) => (
    <button
      onClick={() => { setSelectedStudent(row); setIsModalOpen(true); }}
      className="px-3.5 py-1.5 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
    >
      <ReportsIcon/>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Search students</h1>
        <p className="text-sm text-gray-400 mt-1">
          Find students by roll number or name
        </p>
      </div>

      {/* Search input */}
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

      {/* Results */}
      {debouncedSearchTerm && (
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          {/* Card header */}
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

      <StudentReportsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}