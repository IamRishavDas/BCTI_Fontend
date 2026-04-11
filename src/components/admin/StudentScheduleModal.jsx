// src/components/admin/StudentScheduleModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";

const days = [
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
];

export default function StudentScheduleModal({ isOpen, onClose, student }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
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
    setHasChanges(false);
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

  // Track changes
  const handleInputChange = (dayKey, value) => {
    setFormData({ ...formData, [dayKey]: value });
    setHasChanges(true);
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
        setHasChanges(false);
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
        setHasChanges(false);
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
        setHasChanges(false);
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
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      setFormData({});
    } else if (isEditing) {
      setIsEditing(false);
      setFormData(schedule);
    }
    setHasChanges(false);
  };

  if (!student) return null;

  const isEditMode = isEditing || isCreating;
  const hasScheduledClasses = schedule && Object.values(schedule).some(val => val && val !== "");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[50] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-700 shrink-0">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Roll no: {student.rollNo} · Class Schedule
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative w-12 h-12 mb-4">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-400">Loading schedule...</p>
                </div>
              ) : schedule || isCreating ? (
                <div className="px-6 py-4 space-y-4">
                  {/* Editable Toggle */}
                  {schedule && !isEditMode && (
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          schedule.isEditable ? "bg-green-100" : "bg-amber-100"
                        }`}>
                          {schedule.isEditable ? (
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Student Edit Permission</p>
                          <p className="text-xs text-gray-400">
                            {schedule.isEditable ? "Student can modify schedule" : "Schedule is locked"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleEditable(!schedule.isEditable)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                          schedule.isEditable
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {schedule.isEditable ? "Unlocked" : "Locked"}
                      </button>
                    </div>
                  )}

                    {/* Time Inputs */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weekly Schedule</h3>
                        {isEditMode && hasChanges && (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                            Unsaved changes
                          </span>
                        )}
                      </div>
                      
                      {days.map((day, index) => {
                        const hasValue = formData[day.key] && formData[day.key] !== "";
                        return (
                          <div
                            key={day.key}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                              isEditMode
                                ? "bg-white border border-gray-200 hover:border-blue-300"
                                : hasValue
                                ? "bg-blue-50 border border-blue-100"
                                : "bg-gray-50 border border-gray-100"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-xs ${
                                hasValue
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-200 text-gray-500"
                              }`}>
                                {day.short}
                              </div>
                              <span className="font-medium text-gray-700 capitalize text-sm">
                                {day.label}
                              </span>
                            </div>
                            
                            {isEditMode ? (
                              <input
                                type="time"
                                value={formData[day.key] || ""}
                                onChange={(e) => handleInputChange(day.key, e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all w-32"
                              />
                            ) : (
                              <div className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium ${
                                hasValue
                                  ? "bg-white text-blue-700 border border-blue-200"
                                  : "text-gray-400"
                              }`}>
                                {hasValue ? formData[day.key] : "No class"}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100 mt-4">
                      {isCreating ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="cursor-pointer flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="cursor-pointer flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? "Creating..." : "Create Schedule"}
                          </button>
                        </>
                      ) : isEditing ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="cursor-pointer flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdate}
                            disabled={loading || !hasChanges}
                            className="cursor-pointer flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer flex-1 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                          >
                            Edit Schedule
                          </button>
                          <button
                            onClick={handleDelete}
                            className="cursor-pointer flex-1 py-2.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                          >
                            Delete Schedule
                          </button>
                        </>
                      )}
                    </div>
                  </div>
              ) : (
                /* No Schedule - Create Button */
                <div className="text-center py-12 px-6">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No Schedule Found</h3>
                  <p className="text-xs text-gray-400 mb-6">
                    This student doesn't have a class schedule yet.
                  </p>
                  <button
                    onClick={startCreating}
                    className="cursor-pointer px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Create Schedule
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