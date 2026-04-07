// src/components/admin/NoticesList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function isActive(startDate, endDate) {
  const now = new Date();
  return new Date(startDate) <= now && new Date(endDate) >= now;
}

export default function NoticesList() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    const res = await api.getNotices();
    if (res.success) setNotices(res.data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Notice?",
      message: "This action cannot be undone.",
      confirmText: "Yes, Delete",
      type: "danger",
    });
    if (!isConfirmed) return;

    const res = await api.deleteNotice(id);
    if (res.success) {
      showSuccess("Notice deleted successfully");
      fetchNotices();
    } else {
      showError("Failed to delete notice");
    }
  };

  const activeCount = notices.filter((n) => isActive(n.startDate, n.endDate)).length;

  const columns = [
    {
      header: "Title",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-gray-800 font-medium">{row.title}</span>
          {isActive(row.startDate, row.endDate) && (
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Active
            </span>
          )}
        </div>
      ),
    },
    { header: "For", key: "for" },
    {
      header: "Start Date",
      accessor: (row) => new Date(row.startDate).toLocaleDateString("en-IN"),
    },
    {
      header: "End Date",
      accessor: (row) => new Date(row.endDate).toLocaleDateString("en-IN"),
    },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin/notices/edit/${row.id}`)}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">Notices</h1>
          {!loading && (
            <p className="text-sm text-gray-400 mt-1">
              {notices.length} notice{notices.length !== 1 ? "s" : ""}
              {activeCount > 0 && (
                <span className="ml-2 text-emerald-600 font-medium">
                  · {activeCount} active
                </span>
              )}
            </p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/admin/notices/new")}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusIcon />
          Add Notice
        </motion.button>
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
          data={notices}
          loading={loading}
          actions={actions}
          emptyMessage="No notices found. Create one to get started."
        />
      </motion.div>
    </div>
  );
}