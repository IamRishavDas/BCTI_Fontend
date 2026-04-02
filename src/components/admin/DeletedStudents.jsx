import { useEffect, useState } from "react";
import { api } from "../../services/api";
import DataTable from "../common/DataTable";
import { showSuccess } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext"; 

export default function DeletedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {confirm} = useConfirm();

  useEffect(() => {
    fetchDeleted();
  }, []);

  const fetchDeleted = async () => {
    setLoading(true);
    const res = await api.getDeletedStudents();
    if (res.success) setStudents(res.data || []);
    setLoading(false);
  };

  const handleRestore = async (id) => {
    const isConfirmed = await confirm({
      title: "Restore Student?",
      message: "This student will be restored and become active again.",
      confirmText: "Yes, Restore",
      type: "info"
    });

    if (!isConfirmed) return;
    const res = await api.restoreStudent(id);
    if (res.success) {
      showSuccess("Student restored");
      fetchDeleted();
    }
  };

  const handlePermanentDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Permanent Delete?",
      message: "This will permanently delete the student. This action cannot be undone.",
      confirmText: "Delete Forever",
      type: "danger"
    });

    if (!isConfirmed) return;
    const res = await api.permanentDeleteStudent(id);
    if (res.success) {
      showSuccess("Student permanently deleted");
      fetchDeleted();
    }
  };

  const columns = [
    { header: "Roll No", key: "rollNo" },
    { header: "Name", accessor: (row) => `${row.firstName} ${row.lastName}` },
    { header: "Course", accessor: (row) => row.course?.courseName || "—" },
  ];

  const actions = (row) => (
    <div className="flex gap-3">
      <button onClick={() => handleRestore(row.id)} className="px-5 py-2 bg-emerald-600 text-white rounded-2xl text-sm">Restore</button>
      <button onClick={() => handlePermanentDelete(row.id)} className="px-5 py-2 bg-red-700 text-white rounded-2xl text-sm">Delete Forever</button>
    </div>
  );

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">Deleted Students</h1>
      <DataTable columns={columns} data={students} loading={loading} actions={actions} />
    </div>
  );
};