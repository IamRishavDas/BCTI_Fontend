// src/components/admin/DeletedStudents.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showError, showSuccess } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

function RestoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  );
}

function TrashForeverIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}

export default function DeletedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
    setLoading(true);
    const res = await api.getDeletedStudents();
    if (res.success) setStudents(res.data || []);
    setLoading(false);
  };

  const handleRestore = async (id) => {
    const isConfirmed = await confirm({
      title: "Restore Student?",
      message: "This student will be restored and become active again.",
      confirmText: "Yes, Restore",
      type: "info",
    });
    if (!isConfirmed) return;

    const res = await api.restoreStudent(id);
    if (res.success) {
      showSuccess("Student restored");
      fetchDeleted();
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Permanent Delete?",
      message: "This will permanently delete the student. This action cannot be undone.",
      confirmText: "Delete Forever",
      type: "danger",
    });
    if (!isConfirmed) return;

    const res = await api.permanentDeleteStudent(id);
    if (res.success) {
      showSuccess("Student permanently deleted");
      fetchDeleted();
    } else {
      showError(res.Message || res.message || "Something went wrong, try again later");
    }
  };

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "—" },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleRestore(row.id)}
        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
      >
        <RestoreIcon />
        Restore
      </button>
      <button
        onClick={() => handlePermanentDelete(row.id)}
        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
      >
        <TrashForeverIcon />
        Delete Forever
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-semibold text-gray-900">Deleted Students</h1>
        {!loading && (
          <p className="text-sm text-gray-400 mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} in the deleted list
          </p>
        )}
      </motion.div>

      {/* Warning banner */}
      {!loading && students.length > 0 && (
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
            Students listed here have been soft-deleted. You can restore them or permanently remove them. Permanent deletion cannot be undone.
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
          data={students}
          loading={loading}
          actions={actions}
          emptyMessage="No deleted students found"
        />
      </motion.div>
    </div>
  );
}