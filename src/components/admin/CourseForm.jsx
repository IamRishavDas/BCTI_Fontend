// src/components/admin/CourseForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

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

function RupeeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="4" x2="18" y2="4"/>
      <line x1="6" y1="10" x2="18" y2="10"/>
      <path d="M6 10c0 4 3 8 12 10"/>
      <line x1="6" y1="14" x2="11" y2="14"/>
    </svg>
  );
}

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    courseName: "",
    courseCode: "",
    durationInMonths: 6,
    description: "",
    monthlyFees: 3000,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    const res = await api.getCourseById(id);
    if (res.success) {
      const c = res.data;
      setForm({
        courseName: c.courseName,
        courseCode: c.courseCode,
        durationInMonths: c.durationInMonths,
        description: c.description || "",
        monthlyFees: c.monthlyFees,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = isEdit
      ? await api.updateCourse(id, form)
      : await api.createCourse(form);

    if (res.success) {
      showSuccess(isEdit ? "Course updated successfully" : "Course created successfully");
      navigate("/admin/courses");
    } else {
      showError(res.message || res.Message || "Operation failed");
    }
    setLoading(false);
  };

  // Live preview: total fee
  const totalFees = (form.monthlyFees || 0) * (form.durationInMonths || 0);

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
            {isEdit ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEdit
              ? "Update the course details below"
              : "Fill in the details to publish a new course"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Course Name */}
          <FieldWrapper label="Course Name">
            <input
              type="text"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
              className={inputBase}
              placeholder="e.g. Diploma in Computer Applications"
              required
            />
          </FieldWrapper>

          {/* Course Code */}
          <FieldWrapper label="Course Code">
            <input
              type="text"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
              className={inputBase}
              placeholder="e.g. DCA"
              required
            />
          </FieldWrapper>

          {/* Duration + Monthly Fees */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Duration (Months)">
              <input
                type="number"
                value={form.durationInMonths}
                onChange={(e) =>
                  setForm({ ...form, durationInMonths: parseInt(e.target.value) || 1 })
                }
                className={inputBase}
                min="1"
                max="36"
                required
              />
            </FieldWrapper>

            <FieldWrapper label="Monthly Fees (₹)">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <RupeeIcon />
                </span>
                <input
                  type="number"
                  value={form.monthlyFees}
                  onChange={(e) =>
                    setForm({ ...form, monthlyFees: parseInt(e.target.value) || 0 })
                  }
                  className={inputBase + " pl-8"}
                  required
                />
              </div>
            </FieldWrapper>
          </div>

          {/* Total fees preview */}
          {totalFees > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-sm">
              <span className="text-blue-400">
                <RupeeIcon />
              </span>
              <span className="text-blue-700 font-medium">
                Total course fee: ₹{totalFees.toLocaleString("en-IN")}
              </span>
              <span className="text-blue-400 text-xs ml-1">
                ({form.durationInMonths} months × ₹{form.monthlyFees?.toLocaleString("en-IN")})
              </span>
            </div>
          )}

          {/* Description */}
          <FieldWrapper label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputBase + " h-28 resize-none"}
              placeholder="Brief overview of what this course covers…"
            />
          </FieldWrapper>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-2" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/courses")}
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
              {loading ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}