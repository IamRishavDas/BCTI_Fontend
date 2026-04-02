import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

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
      type: "danger"
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

  const filteredCourses = courses.filter(c =>
    `${c.courseName} ${c.courseCode}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Course Code", key: "courseCode" },
    { header: "Course Name", key: "courseName" },
    { header: "Duration", accessor: (row) => `${row.durationInMonths} Months` },
    { header: "Monthly Fees", accessor: (row) => `₹${row.monthlyFees}` },
    { header: "Total Fees", accessor: (row) => `₹${row.totalFees}` },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin/courses/edit/${row.courseId}`)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(row.courseId)}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded-2xl hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">All Courses</h1>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-6 py-3 border border-gray-300 rounded-3xl w-80 focus:outline-none focus:border-blue-600"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCourses}
        loading={loading}
        actions={actions}
      />
    </div>
  );
}