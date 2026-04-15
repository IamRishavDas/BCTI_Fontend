// src/components/student/StudentProfile.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import StudentScheduleModal from "./StudentScheduleModal";
import { ClockIcon } from "../../static/Svg";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.32, delay: i * 0.07, ease: "easeOut" },
  }),
};

const getInitials = (first, last) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

function Field({ label, value, mono = false }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2.5">
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-medium text-gray-900 ${mono ? "font-mono" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
    </div>
  );
}

function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 animate-pulse ${className}`}>
      <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profileRes] = await Promise.all([
        api.getMyStudentInfo(),
      ]);
      if (profileRes?.success && profileRes?.data) setProfile(profileRes.data);
      else showError(profileRes?.message || "Failed to load profile");
    } catch {
      showError("Unable to load your profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-5 animate-pulse">
          <div className="h-7 w-40 bg-gray-200 rounded-lg" />
          <div className="h-24 bg-white rounded-2xl border border-gray-100" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100" />)}
          </div>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50/60 -m-8 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Unable to load profile</p>
          <p className="text-xs text-gray-400 mb-4">Something went wrong while fetching your data</p>
          <button
            onClick={fetchAll}
            className="cursor-pointer px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const iconStroke = (d) => (
    <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Page header */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
          className="flex items-start justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">My profile</h1>
            <p className="text-sm text-gray-400 mt-1">Your personal information</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduleOpen(true)}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ClockIcon /> Class schedule
            </button>
          </div>
        </motion.div>

        {/* Identity card */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-base font-semibold text-blue-700 shrink-0">
              {getInitials(profile.firstName, profile.lastName)}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{profile.rollNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
              {profile.course?.courseName} ({profile.course?.courseCode})
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
              Sem {profile.currentSem}
            </span>
            {profile.enrolledDate && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
                Enrolled {new Date(profile.enrolledDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </span>
            )}
          </div>
        </motion.div>


        {/* Personal details */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <SectionHeader
            title="Personal details"
            icon={iconStroke("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Field label="Father's name"  value={profile.fathersName} />
            <Field label="Mother's name"  value={profile.mothersName} />
            <Field label="Date of birth"  value={profile.dob ? new Date(profile.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null} />
            <Field label="Gender"         value={profile.gender} />
            <Field label="Religion"       value={profile.religion} />
            <Field label="Qualification"  value={profile.qualification} />
            <Field label="Mobile"         value={profile.mobileNumber} />
            <Field label="Enquiry source" value={profile.enquirySource} />
          </div>
        </motion.div>

        {/* Address */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <SectionHeader
            title="Address"
            icon={iconStroke("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z")}
          />
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-700 leading-relaxed">{profile.address || "No address provided"}</p>
            {profile.pinCode && (
              <p className="text-xs text-gray-400 mt-1.5">Pin code: {profile.pinCode}</p>
            )}
          </div>
        </motion.div>

        {/* Government ID */}
        {(profile.governmentIdType || profile.governmentIdNumber) && (
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <SectionHeader
              title="Government ID"
              icon={iconStroke("M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0")}
            />
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">ID number</p>
                <p className="text-sm font-medium text-gray-900 font-mono">
                  {profile.governmentIdNumber || "—"}
                </p>
              </div>
              {profile.governmentIdType && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                  {profile.governmentIdType}
                </span>
              )}
            </div>
          </motion.div>
        )}

      </div>

      <StudentScheduleModal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}