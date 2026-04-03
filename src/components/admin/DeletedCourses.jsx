import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

export default function DeletedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchDeletedCourses();
  }, []);

  const fetchDeletedCourses = async () => {
    setLoading(true);
    const res = await api.getCourseLookups(true); // isDeleted = true
    if (res.success) {
      setCourses(res.data || []);
    }
    setLoading(false);
  };

  const handleRestore = async (id) => {
    const isConfirmed = await confirm({
      title: "Restore Course?",
      message: "This course will be restored and become active again.",
      confirmText: "Yes, Restore",
      type: "info"
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
      className="px-6 py-2 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 text-sm"
    >
      Restore Course
    </button>
  );

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">Deleted Courses</h1>
      <DataTable
        title="Soft Deleted Courses"
        columns={columns}
        data={courses}
        loading={loading}
        actions={actions}
        emptyMessage="No deleted courses found"
      />
    </div>
  );
}