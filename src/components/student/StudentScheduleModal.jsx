// src/components/student/StudentScheduleModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import TimeInput from "../common/TimeInput";

const days = [
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
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
      const res = await api.updateMySchedule(formData);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[50] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">My Class Schedule</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your weekly class timetable</p>
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
              ) : schedule ? (
                <div className="px-6 py-4 space-y-4">
                  {/* Lock status banner */}
                  {!schedule.isEditable && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-3 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-800">Schedule Locked</p>
                        <p className="text-xs text-amber-600">Your schedule is currently locked by admin</p>
                      </div>
                    </div>
                  )}

                  {/* Weekly Schedule */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Weekly Schedule</h3>
                    </div>

                    {days.map((day) => {
                      const hasValue = formData[day.key] && formData[day.key] !== "";
                      return (
                        <div
                          key={day.key}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                            isEditing
                              ? "bg-white border border-gray-200 hover:border-blue-300"
                              : hasValue
                              ? "bg-blue-50 border border-blue-100"
                              : "bg-gray-50 border border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-xs ${
                              hasValue ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                            }`}>
                              {day.short}
                            </div>
                            <span className="font-medium text-gray-700 text-sm">{day.label}</span>
                          </div>

                          {isEditing ? (
                            <TimeInput
                                value={formData[day.key] || ""}
                                onChange={(v) => handleInputChange(day.key, v)}
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
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(schedule);
                          }}
                          className="cursor-pointer flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={loading}
                          className="cursor-pointer flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    ) : (
                      <>
                        {schedule.isEditable && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer flex-1 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                          >
                            Update Schedule
                          </button>
                        )}
                        <button
                          onClick={onClose}
                          className="cursor-pointer flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No Schedule Assigned</h3>
                  <p className="text-xs text-gray-400">
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