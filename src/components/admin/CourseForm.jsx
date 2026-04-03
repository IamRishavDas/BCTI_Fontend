import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-10">
      <h1 className="text-3xl font-semibold mb-8">
        {isEdit ? "Edit Course" : "Create New Course"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Course Name</label>
          <input
            type="text"
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className="w-full px-5 py-4 border rounded-2xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Course Code</label>
          <input
            type="text"
            value={form.courseCode}
            onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
            className="w-full px-5 py-4 border rounded-2xl"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Duration (Months)</label>
            <input
              type="number"
              value={form.durationInMonths}
              onChange={(e) => setForm({ ...form, durationInMonths: parseInt(e.target.value) })}
              className="w-full px-5 py-4 border rounded-2xl"
              min="1"
              max="36"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Monthly Fees (₹)</label>
            <input
              type="number"
              value={form.monthlyFees}
              onChange={(e) => setForm({ ...form, monthlyFees: parseInt(e.target.value) })}
              className="w-full px-5 py-4 border rounded-2xl"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-5 py-4 border rounded-2xl h-32"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="flex-1 py-4 border-2 border-gray-300 rounded-2xl font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-blue-700 text-white rounded-2xl font-semibold disabled:bg-blue-400 cursor-pointer"
          >
            {loading ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}