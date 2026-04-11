// src/components/student/StudentScheduleModal.jsx
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

export default function StudentScheduleModal({ isOpen, onClose }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { confirm } = useConfirm();

  useEffect(() => {
    if (isOpen) {
      fetchMySchedule();
    }
  }, [isOpen]);

  const fetchMySchedule = async () => {
    setLoading(true);
    try {
      const res = await api.getMySchedule();
      if (res.success && res.data) {
        setSchedule(res.data);
        setFormData(res.data);
      } else {
        setSchedule(null);
      }
    } catch (err) {
      showError("Failed to load your schedule");
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    const isConfirmed = await confirm({
      title: "Update Schedule?",
      message: "Save changes to your class schedule?",
      confirmText: "Save Changes",
    });

    if (!isConfirmed) return;

    setLoading(true);
    try {
      const res = await api.updateMySchedule(formData);   // We'll add this method
      if (res.success) {
        showSuccess("Schedule updated successfully");
        setIsEditing(false);
        fetchMySchedule();
      } else {
        showError(res.message || "Failed to update");
      }
    } catch {
      showError("Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  // Prepare data (empty string → null)
  const prepareData = (data) => {
    const prepared = {};
    days.forEach((day) => {
      const val = data[day.key];
      prepared[day.key] = val && val.trim() !== "" ? val : null;
    });
    return prepared;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-lg">My Class Schedule</h2>
              <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">Loading your schedule...</div>
              ) : schedule ? (
                <div className="space-y-6">
                  {/* Days Schedule */}
                  <div className="space-y-4">
                    {days.map((day) => (
                      <div key={day.key} className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-700 capitalize">{day.label}</span>
                        {isEditing ? (
                          <input
                            type="time"
                            value={formData[day.key] || ""}
                            onChange={(e) => setFormData({ ...formData, [day.key]: e.target.value })}
                            className="border border-gray-300 rounded-xl px-4 py-2 text-sm w-36"
                          />
                        ) : (
                          <span className="font-mono text-gray-600">
                            {schedule[day.key] ? schedule[day.key] : "— No class"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    {isEditing ? (
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
                        {schedule.isEditable && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 py-3 border border-blue-600 text-blue-600 rounded-2xl text-sm font-medium hover:bg-blue-50"
                          >
                            Update Schedule
                          </button>
                        )}
                        <button
                          onClick={onClose}
                          className="flex-1 py-3 border border-gray-300 rounded-2xl text-sm font-medium"
                        >
                          Close
                        </button>
                      </>
                    )}
                  </div>

                  {!schedule.isEditable && (
                    <p className="text-xs text-center text-amber-600 bg-amber-50 py-2 rounded-xl">
                      Your schedule is currently locked by admin
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                    📅
                  </div>
                  <p className="text-lg font-semibold text-gray-700">No Schedule Assigned</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Your admin has not created a schedule for you yet.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}