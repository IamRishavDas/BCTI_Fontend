// src/components/admin/StudentForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  );
}

function FieldWrapper({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 flex items-center gap-1"><LockIcon />{hint}</p>}
    </div>
  );
}

const inputBase =
  "w-full px-4 py-3 text-sm border rounded-2xl focus:outline-none transition-colors duration-150 bg-white";
const inputNormal =
  inputBase + " border-gray-200 focus:border-blue-500 text-gray-800 placeholder-gray-400";
const inputDisabled =
  inputBase + " border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed";

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    rollNo: "",
    enrolledDate: "",
    currentSem: 1,
    courseId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (isEdit) fetchStudent();
  }, [id]);

  const fetchCourses = async () => {
    const res = await api.getCourseLookups(false);
    if (res.success) setCourses(res.data || []);
  };

  const fetchStudent = async () => {
    const res = await api.getStudentById(id);
    if (res.success && res.data) {
      const s = res.data;
      setForm({
        firstName: s.firstName || "",
        lastName: s.lastName || "",
        rollNo: s.rollNo || "",
        enrolledDate: s.enrolledDate ? s.enrolledDate.split("T")[0] : "",
        currentSem: s.currentSem || 1,
        courseId: s.courseId || "",
        password: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let payload = { ...form };

    if (isEdit) {
      delete payload.rollNo;
      delete payload.enrolledDate;
      delete payload.password;

      const res = await api.updateStudent(id, payload);
      if (res.success) {
        showSuccess("Student updated successfully");
        navigate("/admin/students");
      } else {
        showError(res.message || res.Message || "Failed to update student");
      }
    } else {
      const res = await api.createStudent(payload);
      if (res.success) {
        showSuccess("Student created successfully");
        navigate("/admin/students");
      } else {
        showError(res.message || res.Message || "Failed to create student");
      }
    }

    setLoading(false);
  };

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
            {isEdit ? "Edit Student" : "Add New Student"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEdit
              ? "Update student details below"
              : "Fill in the details to register a new student"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="First Name">
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={inputNormal}
                placeholder="e.g. Rahul"
                required
              />
            </FieldWrapper>
            <FieldWrapper label="Last Name">
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={inputNormal}
                placeholder="e.g. Sharma"
                required
              />
            </FieldWrapper>
          </div>

          {/* Roll No */}
          <FieldWrapper
            label="Roll Number"
            hint={isEdit ? "Roll Number cannot be changed after creation" : null}
          >
            <input
              type="text"
              value={form.rollNo}
              onChange={(e) => !isEdit && setForm({ ...form, rollNo: e.target.value })}
              disabled={isEdit}
              placeholder="e.g. BCTI-0012"
              className={isEdit ? inputDisabled : inputNormal}
              required={!isEdit}
            />
          </FieldWrapper>

          {/* Date + Sem */}
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper
              label="Enrolled Date"
              hint={isEdit ? "Cannot be changed after creation" : null}
            >
              <input
                type="date"
                value={form.enrolledDate}
                onChange={(e) => !isEdit && setForm({ ...form, enrolledDate: e.target.value })}
                disabled={isEdit}
                className={isEdit ? inputDisabled : inputNormal}
                required={!isEdit}
              />
            </FieldWrapper>

            <FieldWrapper label="Current Semester">
              <input
                type="number"
                value={form.currentSem}
                onChange={(e) => setForm({ ...form, currentSem: parseInt(e.target.value) || 1 })}
                className={inputNormal}
                min="1"
                max="20"
                required
              />
            </FieldWrapper>
          </div>

          {/* Course select */}
          <FieldWrapper label="Course">
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className={inputNormal + " cursor-pointer"}
              required
            >
              <option value="">Choose a course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName} ({course.courseCode})
                </option>
              ))}
            </select>
          </FieldWrapper>

          {/* Password — create only */}
          {!isEdit && (
            <FieldWrapper label="Password">
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputNormal}
                placeholder="Set a login password for the student or default password is Student@1234"
              />
            </FieldWrapper>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 pt-2" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
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
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Student"
                : "Create Student"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}