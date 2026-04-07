// src/components/admin/StudentSearch.jsx
import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showError } from "../../utils/toast";
import StudentReportsModal from "./StudentReportsModal";

export default function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Debounce logic - waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Perform search when debounced term changes
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
    } catch (error) {
      console.error(error);
      showError("Search failed. Please try again.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const openStudentReports = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "—" },
    { header: "Semester", key: "currentSem" },
  ];

  const actions = (row) => (
    <button
      onClick={() => openStudentReports(row)}
      className="px-6 py-2 bg-blue-600 text-white text-sm rounded-2xl hover:bg-blue-700 transition-all"
    >
      View Reports
    </button>
  );

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">Search Students</h1>

      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Roll No or Student Name..."
          className="w-full px-6 py-4 border border-gray-300 rounded-3xl focus:outline-none focus:border-blue-600 text-lg"
        />
        <p className="text-xs text-gray-500 mt-2 pl-2">
          Type at least 2 characters to search • Results update automatically
        </p>
      </div>

      {debouncedSearchTerm && (
        <DataTable
          title={`Search Results for "${debouncedSearchTerm}"`}
          columns={columns}
          data={students}
          loading={loading}
          actions={actions}
          emptyMessage="No students found matching your search."
        />
      )}

      {/* Student Reports Modal */}
      <StudentReportsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}