import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast";
import { useConfirm } from "../../contexts/confirmContext";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const {confirm} = useConfirm();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const res = await api.getStudents();
    if (res.success) setStudents(res.data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    console.log("Delete clicked");
    const isConfirmed = await confirm({
      title: "Delete Student?",
      message: "This will move the student to the deleted list. This action cannot be undone.",
      confirmText: "Yes, Delete",
      type: "danger"
    });

    if (!isConfirmed) return;

    const res = await api.softDeleteStudent(id);
    if (res.success) {
      showSuccess("Student moved to deleted list");
      fetchStudents();
    } else {
      showError("Failed to delete student, try again later");
    }
  };

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.rollNo}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "—", },
    { header: "Semester", key: "currentSem" },
    { header: "Enrolled", accessor: (row) => new Date(row.enrolledDate).toLocaleDateString() },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/admin/students/edit/${row.id}`)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(row.id)}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded-2xl hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold">All Students</h1>
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-6 py-3 border border-gray-300 rounded-3xl w-80 focus:outline-none focus:border-blue-600"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
        actions={actions}
      />
    </div>
  );
}