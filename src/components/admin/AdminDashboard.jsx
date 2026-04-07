// src/components/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { useConfirm } from "../../contexts/ConfirmContext";
import { AddBookIcon, AddPersonIcon, ArrowIcon, CoursesIcon, KeyIcon, SearchIcon, StudentsIcon } from "../../static/Svg";
import { Navigate, useNavigate } from "react-router-dom";


const STAT_CONFIG = [
  {
    key: "totalStudents",
    label: "Total Students",
    Icon: StudentsIcon,
    accent: { text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  },
  {
    key: "totalCourses",
    label: "Total Courses",
    Icon: CoursesIcon,
    accent: { text: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  },
];

const QUICK_ACTIONS = [
  {
    label: "Search Student",
    description: "Find Student detail by roll no or name",
    Icon: SearchIcon,
    accent: { text: "#2563eb", bg: "#eff6ff", hoverBorder: "#93c5fd", hoverBg: "#eff6ff" },
    href: "/admin/students/search"
  },
  {
    label: "Reset Student Password",
    description: "Reset password for any student by Roll No",
    Icon: KeyIcon,
    accent: { text: "#2563eb", bg: "#eff6ff", hoverBorder: "#93c5fd", hoverBg: "#eff6ff" },
    actionKey: "resetPassword",
  },
  {
    label: "Add New Student",
    description: "Register a new student in the system",
    Icon: AddPersonIcon,
    accent: { text: "#16a34a", bg: "#f0fdf4", hoverBorder: "#86efac", hoverBg: "#f0fdf4" },
    href: "/admin/students/new",
  },
  {
    label: "Add New Course",
    description: "Create and publish a new course",
    Icon: AddBookIcon,
    accent: { text: "#d97706", bg: "#fffbeb", hoverBorder: "#fcd34d", hoverBg: "#fffbeb" },
    href: "/admin/courses/new",
  },
];

function StatCard({ config, value, loading, index }) {
  const { label, Icon, accent } = config;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-8 shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p
            className="text-5xl font-bold mt-3"
            style={{ color: accent.text }}
          >
            {loading ? (
              <span className="inline-block w-16 h-10 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              value
            )}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: accent.bg, color: accent.text, border: `1px solid ${accent.border}` }}
        >
          <Icon />
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ action, onClick, index }) {
  const { label, description, Icon, accent } = action;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left w-full p-7 rounded-3xl border-2 border-dashed transition-all duration-200 group"
      style={{
        borderColor: hovered ? accent.hoverBorder : "#e5e7eb",
        background: hovered ? accent.hoverBg : "#ffffff",
        cursor: "pointer",
      }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-200"
        style={{
          background: hovered ? accent.bg : "#f8fafc",
          color: hovered ? accent.text : "#94a3b8",
          border: `1px solid ${hovered ? accent.hoverBorder : "#f1f5f9"}`,
        }}
      >
        <Icon />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className="font-semibold text-base transition-colors duration-200"
            style={{ color: hovered ? accent.text : "#111827" }}
          >
            {label}
          </h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <span
          className="mt-0.5 flex-shrink-0 transition-all duration-200"
          style={{
            color: hovered ? accent.text : "#d1d5db",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
          }}
        >
          <ArrowIcon />
        </span>
      </div>
    </motion.button>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0 });
  const [loading, setLoading] = useState(true);
  const { promptInput, confirm } = useConfirm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesCountRes] = await Promise.all([
        api.getStudentCount(false),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/courses/count?isDeleted=false`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res) => res.json()),
      ]);

      if (studentsRes?.success) {
        setStats((prev) => ({
          ...prev,
          totalStudents: studentsRes.data || 0,
        }));
      }
      if (coursesCountRes.success) {
        setStats((prev) => ({ ...prev, totalCourses: coursesCountRes.data || 0 }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const rollNo = await promptInput({
      title: "Reset Student Password",
      message: "Enter the Roll Number of the student",
      placeholder: "e.g. BCTI-0123",
      confirmText: "Continue",
    });
    if (!rollNo || !rollNo.trim()) return;

    const trimmedRollNo = rollNo.trim();

    const isConfirmed = await confirm({
      title: "Confirm Password Reset",
      message: `Are you sure you want to reset the password for student "${trimmedRollNo}"?`,
      confirmText: "Yes, Reset Password",
      type: "warning",
    });
    if (!isConfirmed) return;

    try {
      const result = await api.resetStudentPassword(trimmedRollNo);
      if (result.data?.success) {
        showSuccess(`Password reset successful for student ${trimmedRollNo}`);
      } else {
        showError(result.data?.message || result.data?.Message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      showError("Something went wrong. Please try again.");
    }
  };

  const actionHandlers = {
    resetPassword: handleResetPassword,
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-semibold text-gray-900">Welcome back, Admin</h1>
        <p className="text-gray-500 mt-2">
          Here's an overview of BCTI Computer Training Institute
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STAT_CONFIG.map((config, i) => (
          <StatCard
            key={config.key}
            config={config}
            value={stats[config.key]}
            loading={loading}
            index={i}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-3xl p-8 shadow">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {QUICK_ACTIONS.map((action, i) => (
            <QuickActionCard
              key={action.label}
              action={action}
              index={i}
              onClick={
                action.actionKey
                  ? actionHandlers[action.actionKey]
                  : () => navigate(action.href)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}