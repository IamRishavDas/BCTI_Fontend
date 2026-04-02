import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { motion } from "framer-motion";
import { showError, showSuccess } from "../../utils/toast";

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
    if (isEdit) fetchStudent();
  }, [id]);

  // Fetch courses for dropdown
  useEffect(() => {
    fetchCourses();
    if (isEdit) fetchStudent();
  }, [id]);

  const fetchCourses = async () => {
    const res = await api.getCourseLookups(false); // active courses only
    if (res.success) setCourses(res.data || []);
  };

  const fetchStudent = async () => {
    const res = await api.getStudentById(id);
    if (res.success) {
      const s = res.data;
      setForm({
        firstName: s.firstName,
        lastName: s.lastName,
        rollNo: s.rollNo,
        enrolledDate: s.enrolledDate.split("T")[0],
        currentSem: s.currentSem,
        courseId: s.courseId,
        password: "", // password not shown on edit
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let res;
    if (isEdit) {
      res = await api.updateStudent(id, form);
    } else {
      res = await api.createStudent(form);
    }

    console.log(res);

    if (res.success) {
      showSuccess(isEdit ? "Student updated successfully" : "Student created successfully");
      navigate("/admin/students");
    } else {
      showError(res.message ||  "Operation failed");
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10"
    >
      <h1 className="text-3xl font-semibold mb-8">{isEdit ? "Edit Student" : "Add New Student"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Roll Number</label>
          <input type="text" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" required />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Enrolled Date</label>
            <input type="date" value={form.enrolledDate} onChange={(e) => setForm({ ...form, enrolledDate: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Current Semester</label>
            <input type="number" value={form.currentSem} onChange={(e) => setForm({ ...form, currentSem: parseInt(e.target.value) })} className="w-full px-5 py-4 border rounded-2xl" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Course</label>
          <select
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            className="w-full px-5 py-4 border rounded-2xl"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
          </select>
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium mb-2">Password (for new student)</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-5 py-4 border rounded-2xl" required />
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <button type="button" onClick={() => navigate("/admin/students")} className="flex-1 py-4 border-2 border-gray-400 rounded-2xl font-medium">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-700 text-white rounded-2xl font-semibold">
            {loading ? "Saving..." : isEdit ? "Update Student" : "Create Student"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}