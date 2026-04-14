// src/components/admin/StudentInfoModal.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";

export default function StudentInfoModal({ isOpen, onClose, student }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && student?.id) {
      fetchStudentDetails();
    }
  }, [isOpen, student]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    setError(null);
    setDetails(null);

    try {
      const res = await api.getStudentInfo(student.id);

      console.log("Student Info Response:", res); // ← For debugging

      if (res?.success && res?.data) {
        setDetails(res.data);
      } else {
        setError(res?.message || "Failed to load student details");
        showError(res?.message || "Failed to load student details");
      }
    } catch (err) {
      console.error("Error fetching student info:", err);
      setError("Unable to fetch student information");
      showError("Unable to fetch student information");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Student Information</h2>
              {student && (
                <p className="text-sm text-gray-500">
                  {student.firstName} {student.lastName} • {student.rollNo}
                </p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-3xl text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-8">
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={fetchStudentDetails}
                  className="mt-4 px-6 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && details && (
              <div className="space-y-8">
                {/* Basic Info */}
                <div>
                  <h3 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 block">Roll No</span>
                      <span className="font-medium">{details.rollNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Course</span>
                      <span className="font-medium">{details.course?.courseName || "—"} ({details.course?.courseCode})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Semester</span>
                      <span className="font-medium">{details.currentSem}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Enrolled Date</span>
                      <span className="font-medium">
                        {details.enrolledDate ? new Date(details.enrolledDate).toLocaleDateString('en-IN') : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div>
                  <h3 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-3">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                    <div><span className="text-gray-500">Father's Name:</span> <span className="font-medium">{details.fathersName || "—"}</span></div>
                    <div><span className="text-gray-500">Mother's Name:</span> <span className="font-medium">{details.mothersName || "—"}</span></div>
                    <div><span className="text-gray-500">Spouse Name:</span> <span className="font-medium">{details.spouseName || "—"}</span></div>
                    <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{details.dob ? new Date(details.dob).toLocaleDateString('en-IN') : "—"}</span></div>
                    <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{details.gender || "—"}</span></div>
                    <div><span className="text-gray-500">Religion:</span> <span className="font-medium">{details.religion || "—"}</span></div>
                    <div><span className="text-gray-500">Qualification:</span> <span className="font-medium">{details.qualification || "—"}</span></div>
                    <div><span className="text-gray-500">Mobile:</span> <span className="font-medium">{details.mobileNumber || "—"}</span></div>
                  </div>
                </div>

                {/* Address & ID */}
                <div>
                  <h3 className="uppercase text-xs font-semibold tracking-widest text-gray-400 mb-3">Address & Identification</h3>
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <p className="text-gray-600 leading-relaxed">{details.address || "No address provided"}</p>
                    {details.pinCode && (
                      <p className="mt-3"><span className="font-medium">Pin Code:</span> {details.pinCode}</p>
                    )}
                  </div>

                  {(details.governmentIdType || details.governmentIdNumber) && (
                    <div className="mt-6">
                      <p className="text-xs text-gray-500 mb-1">Government ID</p>
                      <p className="font-medium">
                        {details.governmentIdType} — {details.governmentIdNumber || "—"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && !details && (
              <div className="text-center py-20 text-gray-500">
                No details available
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button 
              onClick={onClose}
              className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}