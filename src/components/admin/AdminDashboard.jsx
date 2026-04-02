import { useEffect, useState } from "react";
import { api } from "../../services/api";
import StatsCard from "../common/StatsCard";
import DataTable from "../common/DataTable";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getStudents();
        if (res.success) {
          setStudents(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Student Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "N/A" },
    { header: "Current Semester", key: "currentSem" },
    { header: "Enrolled Date", accessor: (row) => new Date(row.enrolledDate).toLocaleDateString() },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Welcome back, Admin</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Students" value={students.length} icon="👨‍🎓" color="blue" />
        <StatsCard title="Active Students" value={students.length} icon="✅" color="emerald" />
        <StatsCard title="Courses Offered" value="14" icon="📚" color="amber" />
        <StatsCard title="Monthly Intake" value="38" icon="📈" color="purple" />
      </div>

      {/* Students Table */}
      <DataTable
        title="Recent Students"
        columns={columns}
        data={students.slice(0, 8)}   // Show only first 8
        loading={loading}
      />
    </div>
  );
}