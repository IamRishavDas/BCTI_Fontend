// src/components/admin/NoticeForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { getTodayDate } from "../../utils/shared";

const inputBase =
  "w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors duration-150 bg-white text-gray-800 placeholder-gray-400";

function FieldWrapper({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export default function NoticeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: "",
    for: "",
    startDate: "",
    endDate: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    const res = await api.getNoticeById(id);
    if (res.success && res.data) {
      const n = res.data;
      setForm({
        title: n.title,
        for: n.for,
        startDate: n.startDate.split("T")[0],
        endDate: n.endDate.split("T")[0],
        body: n.body,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = isEdit
      ? await api.updateNotice(id, form)
      : await api.createNotice(form);

    if (res.success) {
      showSuccess(isEdit ? "Notice updated successfully" : "Notice created successfully");
      navigate("/admin/notices");
    } else {
      showError(res.message || "Operation failed");
    }
    setLoading(false);
  };

  // Duration preview
  const durationDays =
    form.startDate && form.endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)
          )
        )
      : null;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow p-10"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            {isEdit ? "Edit Notice" : "Create New Notice"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEdit
              ? "Update the notice details below"
              : "Fill in the details to publish a new notice"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <FieldWrapper label="Notice Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputBase}
              placeholder="e.g. Holiday Notice — Durga Puja"
              required
            />
          </FieldWrapper>

          {/* Audience */}
          <FieldWrapper label="For (Target Audience)">
            <input
              type="text"
              value={form.for}
              onChange={(e) => setForm({ ...form, for: e.target.value })}
              className={inputBase}
              placeholder="e.g. All Students, Web Development Batch"
              required
            />
          </FieldWrapper>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Start Date">
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={inputBase}
                required
                min={getTodayDate()}
              />
            </FieldWrapper>
            <FieldWrapper label="End Date">
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={inputBase}
                required
                min={getTodayDate()}
              />
            </FieldWrapper>
          </div>

          {/* Duration preview */}
          {durationDays !== null && (
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="font-medium">
                {durationDays === 0
                  ? "Same-day notice"
                  : `Active for ${durationDays} day${durationDays !== 1 ? "s" : ""}`}
              </span>
            </div>
          )}

          {/* Body */}
          <FieldWrapper label="Notice Body">
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className={inputBase + " h-44 resize-none"}
              placeholder="Write the full notice content here…"
              required
            />
          </FieldWrapper>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-2" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/notices")}
              className="flex-1 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-2xl transition-colors cursor-pointer"
            >
              {loading ? "Saving..." : isEdit ? "Update Notice" : "Publish Notice"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}