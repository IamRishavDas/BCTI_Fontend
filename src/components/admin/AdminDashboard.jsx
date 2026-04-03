import { useEffect, useState } from "react";
import { api } from "../../services/api";
import StatsCard from "../common/StatsCard";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);
  const { promptInput, confirm } = useConfirm();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesCountRes] = await Promise.all([
        api.getStudents(1, 1),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/count?isDeleted=false`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then(res => res.json())
      ]);

      if (studentsRes.data?.success) {
        setStats(prev => ({ ...prev, totalStudents: studentsRes.data.data?.length || 0 }));
      }
      if (coursesCountRes.success) {
        setStats(prev => ({ ...prev, totalCourses: coursesCountRes.data || 0 }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // 1. Get Roll No
    const rollNo = await promptInput({
      title: "Reset Student Password",
      message: "Enter the Roll Number of the student",
      placeholder: "e.g. BCTI-0123",
      confirmText: "Continue",
    });

    if (!rollNo || !rollNo.trim()) return;

    const trimmedRollNo = rollNo.trim();

    // 2. Show Confirmation Modal
    const isConfirmed = await confirm({
      title: "Confirm Password Reset",
      message: `Are you sure you want to reset the password for student "${trimmedRollNo}"?`,
      confirmText: "Yes, Reset Password",
      type: "warning"
    });

    if (!isConfirmed) return;

    // 3. Call API and ensure modal closes
    try {
      const result = await api.resetStudentPassword(trimmedRollNo);

      if (result.data?.success) {
        showSuccess(`Password reset successful for student ${trimmedRollNo}`);
      } else {
        showError(result.data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      showError("Something went wrong. Please try again.");
    }
    // Modal will close automatically because we awaited the confirm promise
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Welcome back, Admin</h1>
        <p className="text-gray-600">Here's an overview of BCTI Computer Training Institute</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Students" value={stats.totalStudents} icon="👨‍🎓" color="blue" />
        <StatsCard title="Total Courses" value={stats.totalCourses} icon="📚" color="amber" />
        <StatsCard title="Active Batches" value="12" icon="🔄" color="emerald" />
        <StatsCard title="This Month Intake" value="48" icon="📈" color="purple" />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleResetPassword}
            className="p-8 border-2 border-dashed border-gray-300 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
          >
            <div className="text-4xl mb-4">🔑</div>
            <h3 className="font-semibold text-lg group-hover:text-blue-600">Reset Student Password</h3>
            <p className="text-sm text-gray-500 mt-2">Reset password for any student by Roll No</p>
          </button>

          <button
            onClick={() => window.location.href = "/admin/students/new"}
            className="p-8 border-2 border-dashed border-gray-300 rounded-3xl hover:border-emerald-600 hover:bg-emerald-50 transition-all group text-left"
          >
            <div className="text-4xl mb-4">👨‍🎓</div>
            <h3 className="font-semibold text-lg group-hover:text-emerald-600">Add New Student</h3>
          </button>

          <button
            onClick={() => window.location.href = "/admin/courses/new"}
            className="p-8 border-2 border-dashed border-gray-300 rounded-3xl hover:border-amber-600 hover:bg-amber-50 transition-all group text-left"
          >
            <div className="text-4xl mb-4">📖</div>
            <h3 className="font-semibold text-lg group-hover:text-amber-600">Add New Course</h3>
          </button>
        </div>
      </div>
    </div>
  );
}