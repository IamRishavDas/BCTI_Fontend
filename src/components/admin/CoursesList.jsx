// src/components/admin/CoursesList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import { EditIcon, PlusIcon, SearchIcon, SearchIconL, TrashIcon } from "../../static/Svg";


export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await api.getCourses();
    if (res.success) setCourses(res.data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Course?",
      message: "This will soft delete the course. Students may be affected.",
      confirmText: "Yes, Delete",
      type: "danger",
    });
    if (!isConfirmed) return;

    const res = await api.softDeleteCourse(id);
    if (res.success) {
      showSuccess("Course deleted successfully");
      fetchCourses();
    } else {
      showError("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((c) =>
    `${c.courseName} ${c.courseCode}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Code",         key: "courseCode" },
    { header: "Course Name",  key: "courseName" },
    { header: "Duration",     accessor: (row) => `${row.durationInMonths} months` },
    { header: "Monthly Fee",  accessor: (row) => `₹${row.monthlyFees?.toLocaleString("en-IN")}` },
    { header: "Total Fee",    accessor: (row) => `₹${row.totalFees?.toLocaleString("en-IN")}` },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin/courses/edit/${row.courseId}`)}
        className="px-4 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <EditIcon/>
      </button>
      <button
        onClick={() => handleDelete(row.courseId)}
        className="px-4 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
      >
        <TrashIcon/>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">All Courses</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {courses.length} course{courses.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIconL />
            </span>
            <input
              type="text"
              placeholder="Search by name or code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-2xl w-64 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Add button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/admin/courses/new")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors cursor-pointer"
          >
            <PlusIcon />
            Add Course
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
          data={filteredCourses}
          loading={loading}
          actions={actions}
        />
      </motion.div>

      {/* Empty state when search yields nothing */}
      {!loading && filteredCourses.length === 0 && search && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400 text-sm"
        >
          No courses found for "<span className="font-medium text-gray-600">{search}</span>"
        </motion.div>
      )}
    </div>
  );
}