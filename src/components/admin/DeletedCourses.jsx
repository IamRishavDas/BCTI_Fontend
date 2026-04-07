// src/components/admin/DeletedCourses.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

function RestoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );
}

export default function DeletedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchDeletedCourses();
  }, []);

  const fetchDeletedCourses = async () => {
    setLoading(true);
    const res = await api.getCourseLookups(true);
    if (res.success) setCourses(res.data || []);
    setLoading(false);
  };

  const handleRestore = async (id) => {
    const isConfirmed = await confirm({
      title: "Restore Course?",
      message: "This course will be restored and become active again.",
      confirmText: "Yes, Restore",
      type: "info",
    });
    if (!isConfirmed) return;

    const res = await api.restoreCourse(id);
    if (res.success) {
      showSuccess("Course restored successfully");
      fetchDeletedCourses();
    } else {
      showError("Failed to restore course");
    }
  };

  const columns = [
    { header: "Course Code", key: "courseCode" },
    { header: "Course Name", key: "courseName" },
  ];

  const actions = (row) => (
    <button
      onClick={() => handleRestore(row.courseId)}
      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
    >
      <RestoreIcon />
      Restore
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-semibold text-gray-900">Deleted Courses</h1>
        {!loading && (
          <p className="text-sm text-gray-400 mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} in the deleted list
          </p>
        )}
      </motion.div>

      {/* Warning banner */}
      {!loading && courses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>
            Courses listed here are soft-deleted and not visible to students. Restoring a course will make it available again for enrollment.
          </span>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl shadow overflow-hidden"
      >
        <DataTable
          columns={columns}
          data={courses}
          loading={loading}
          actions={actions}
          emptyMessage="No deleted courses found"
        />
      </motion.div>
    </div>
  );
}