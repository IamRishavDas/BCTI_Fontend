import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

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
    const res = await api.getCourseLookups(false); // only active courses
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
      // Remove fields not allowed in StudentUpdateDTO
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
      // Create new student - full payload allowed
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
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10">
      <h1 className="text-3xl font-semibold mb-8">
        {isEdit ? "Edit Student" : "Add New Student"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600"
              required
            />
          </div>
        </div>

        {/* Roll No - Editable when creating, Read-only when editing */}
        <div>
          <label className="block text-sm font-medium mb-2">Roll Number</label>
          <input
            type="text"
            value={form.rollNo}
            onChange={(e) => !isEdit && setForm({ ...form, rollNo: e.target.value })}
            disabled={isEdit}
            placeholder="e.g. BCTI-0012"
            className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-600 ${
              isEdit ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            required={!isEdit}
          />
          {isEdit && (
            <p className="text-xs text-gray-500 mt-1">Roll Number cannot be changed after creation</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Enrolled Date</label>
            <input
              type="date"
              value={form.enrolledDate}
              onChange={(e) => !isEdit && setForm({ ...form, enrolledDate: e.target.value })}
              disabled={isEdit}
              className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:border-blue-600 ${
                isEdit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              required={!isEdit}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current Semester</label>
            <input
              type="number"
              value={form.currentSem}
              onChange={(e) => setForm({ ...form, currentSem: parseInt(e.target.value) || 1 })}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600"
              min="1"
              max="20"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Course</label>
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 cursor-pointer"
            required
          >
            <option value="">Choose a Course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
          </select>
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium mb-2">Password (for login)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600"
              placeholder="Enter password for student"
            />
          </div>
        )}

        <div className="flex gap-4 pt-8">
          <button
            type="button"
            onClick={() => navigate("/admin/students")}
            className="flex-1 py-4 border-2 border-gray-300 hover:bg-gray-50 font-medium rounded-2xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl transition-all disabled:bg-blue-400 cursor-pointer"
          >
            {loading ? "Saving..." : isEdit ? "Update Student" : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
}