// src/components/admin/StudentInfoModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";

const Field = ({ label, value }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
    <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-gray-900">{value || "—"}</p>
  </div>
);

const SectionHeader = ({ icon, label }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
  </div>
);

const getInitials = (first, last) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

export default function StudentInfoModal({ isOpen, onClose, student }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && student?.id) fetchStudentDetails();
  }, [isOpen, student]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    setDetails(null);
    try {
      const res = await api.getStudentInfo(student.id);
      if (res?.success && res?.data) {
        setDetails(res.data);
      } else {
        const msg = res?.message || "Failed to load student details";
        setError(msg);
        showError(msg);
      }
    } catch {
      setError("Unable to fetch student information");
      showError("Unable to fetch student information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[200] flex items-center justify-center p-4">
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
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-medium text-blue-600 shrink-0">
                  {student ? getInitials(student.firstName, student.lastName) : "—"}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Student information</h2>
                  {student && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {student.firstName} {student.lastName} · {student.rollNo}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Quick-info pills */}
            {details && (
              <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 border-b border-gray-100 shrink-0 flex-wrap">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                  {details.course?.courseName || "—"} ({details.course?.courseCode})
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                  Sem {details.currentSem}
                </span>
                {details.enrolledDate && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                    Enrolled {new Date(details.enrolledDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative w-10 h-10 mb-3">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse" />
                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                  <p className="text-xs text-gray-400">Loading student details...</p>
                </div>
              )}

              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Failed to load details</p>
                  <p className="text-xs text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={fetchStudentDetails}
                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && !details && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-800">No details available</p>
                </div>
              )}

              {!loading && !error && details && (
                <div className="space-y-5">
                  {/* Personal details */}
                  <div>
                    <SectionHeader
                      label="Personal details"
                      icon={
                        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Father's name" value={details.fathersName} />
                      <Field label="Mother's name" value={details.mothersName} />
                      <Field label="Date of birth" value={details.dob ? new Date(details.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null} />
                      <Field label="Gender" value={details.gender} />
                      <Field label="Religion" value={details.religion} />
                      <Field label="Mobile" value={details.mobileNumber} />
                      <Field label="Qualification" value={details.qualification} />
                      <Field label="Spouse name" value={details.spouseName} />
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Address */}
                  <div>
                    <SectionHeader
                      label="Address"
                      icon={
                        <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                    />
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {details.address || "No address provided"}
                      </p>
                      {details.pinCode && (
                        <p className="text-xs text-gray-400 mt-1.5">Pin code: {details.pinCode}</p>
                      )}
                    </div>
                  </div>

                  {/* Government ID */}
                  {(details.governmentIdType || details.governmentIdNumber) && (
                    <>
                      <div className="border-t border-gray-100" />
                      <div>
                        <SectionHeader
                          label="Government ID"
                          icon={
                            <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                            </svg>
                          }
                        />
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                          <div>
                            <p className="text-[10px] text-gray-400 mb-0.5">ID number</p>
                            <p className="text-sm font-medium text-gray-900">
                              {details.governmentIdNumber || "—"}
                            </p>
                          </div>
                          {details.governmentIdType && (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                              {details.governmentIdType}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}