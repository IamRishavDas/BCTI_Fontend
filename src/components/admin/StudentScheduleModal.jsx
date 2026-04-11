// src/components/admin/StudentScheduleModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

const days = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
];

export default function StudentScheduleModal({ isOpen, onClose, student }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const { confirm } = useConfirm();

  useEffect(() => {
    if (isOpen && student?.id) {
      resetState();
      fetchSchedule();
    }
  }, [isOpen, student]);

  const resetState = () => {
    setSchedule(null);
    setIsEditing(false);
    setIsCreating(false);
    setFormData({});
  };

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await api.getStudentSchedule(student.id);
      if (res.success && res.data) {
        setSchedule(res.data);
        setFormData(res.data);
      } else {
        setSchedule(null);
      }
    } catch {
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Convert empty string to null
  const prepareScheduleData = (data) => {
    const prepared = {};
    days.forEach((day) => {
      const value = data[day.key];
      prepared[day.key] = value && value.trim() !== "" ? value : null;
    });
    return prepared;
  };

  // Create Schedule
  const handleCreate = async () => {
    const isConfirmed = await confirm({
      title: "Create Schedule?",
      message: `Create class schedule for ${student.firstName} ${student.lastName}?`,
      confirmText: "Create Schedule",
    });

    if (!isConfirmed) return;

    setLoading(true);
    try {
      const preparedData = prepareScheduleData(formData);
      const res = await api.createSchedule(student.id, preparedData);

      if (res.success) {
        showSuccess("Schedule created successfully");
        setIsCreating(false);
        fetchSchedule();
      } else {
        showError(res.message || "Failed to create schedule");
      }
    } catch {
      showError("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  // Update Schedule
  const handleUpdate = async () => {
    const isConfirmed = await confirm({
      title: "Update Schedule?",
      message: "Save changes to this student's schedule?",
      confirmText: "Save Changes",
    });

    if (!isConfirmed) return;

    setLoading(true);
    try {
      const preparedData = prepareScheduleData(formData);
      const res = await api.updateSchedule(student.id, preparedData);

      if (res.success) {
        showSuccess("Schedule updated successfully");
        setIsEditing(false);
        fetchSchedule();
      } else {
        showError(res.message || "Failed to update schedule");
      }
    } catch {
      showError("Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  // Delete Schedule
  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Schedule?",
      message: "This action cannot be undone.",
      confirmText: "Yes, Delete",
      type: "danger",
    });

    if (!isConfirmed) return;

    setLoading(true);
    try {
      const res = await api.deleteSchedule(student.id);
      if (res.success) {
        showSuccess("Schedule deleted successfully");
        setSchedule(null);
        setIsCreating(false);
        setIsEditing(false);
      }
    } catch {
      showError("Failed to delete schedule");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Editable
  const toggleEditable = async (makeEditable) => {
    try {
      const res = await api.toggleScheduleEditable(student.id, makeEditable);
      if (res.success) {
        showSuccess(`Schedule is now ${makeEditable ? "editable" : "locked"} for the student`);
        fetchSchedule();
      }
    } catch {
      showError("Failed to change permission");
    }
  };

  const startCreating = () => {
    const emptyForm = {};
    days.forEach(day => emptyForm[day.key] = "");
    setFormData(emptyForm);
    setIsCreating(true);
  };

  if (!student) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="font-semibold text-lg">Schedule Management</h2>
                <p className="text-sm text-gray-500">{student.firstName} {student.lastName} • {student.rollNo}</p>
              </div>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading schedule...</div>
              ) : schedule || isCreating ? (
                <div className="space-y-6">
                  {/* Editable Toggle */}
                  {schedule && (
                    <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-2xl">
                      <span className="text-sm">Allow student to edit their schedule</span>
                      <button
                        onClick={() => toggleEditable(!schedule.isEditable)}
                        className={`px-5 py-1.5 text-xs font-medium rounded-2xl transition-all ${
                          schedule.isEditable 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {schedule.isEditable ? "Unlocked" : "Locked"}
                      </button>
                    </div>
                  )}

                  {/* Time Inputs */}
                  <div className="space-y-4">
                    {days.map((day) => (
                      <div key={day.key} className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 w-28 capitalize">{day.label}</span>
                        <input
                          type="time"
                          value={formData[day.key] || ""}
                          onChange={(e) => setFormData({ ...formData, [day.key]: e.target.value })}
                          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 w-40"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6">
                    {isCreating ? (
                      <>
                        <button 
                          onClick={() => { setIsCreating(false); setFormData({}); }}
                          className="flex-1 py-3 border border-gray-300 rounded-2xl text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleCreate}
                          className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
                        >
                          Create Schedule
                        </button>
                      </>
                    ) : isEditing ? (
                      <>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="flex-1 py-3 border border-gray-300 rounded-2xl text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleUpdate}
                          className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-2xl text-sm font-medium hover:bg-blue-50"
                        >
                          Edit Schedule
                        </button>
                        <button 
                          onClick={handleDelete}
                          className="flex-1 py-3 bg-red-600 text-white rounded-2xl text-sm font-medium hover:bg-red-700"
                        >
                          Delete Schedule
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* No Schedule - Create Button */
                <div className="text-center py-14">
                  <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                    📅
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">No Schedule Found</p>
                  <p className="text-sm text-gray-500 mb-8">
                    This student does not have a class schedule yet.
                  </p>
                  <button
                    onClick={startCreating}
                    className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all"
                  >
                    + Create Schedule
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}