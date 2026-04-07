// src/components/common/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { isAdmin } from "../../utils/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const adminMenu = [
  { label: "Dashboard",        path: "/admin/dashboard",          icon: AdminDashIcon  },
  { label: "All Students",     path: "/admin/students",           icon: StudentsIcon   },
  { label: "All Courses",      path: "/admin/courses",            icon: CoursesIcon    },
  { label: "Add Student",      path: "/admin/students/new",       icon: AddPersonIcon  },
  { label: "Add Course",       path: "/admin/courses/new",        icon: AddBookIcon    },
  { label: "Deleted Students", path: "/admin/students/deleted",   icon: TrashIcon      },
  { label: "Deleted Courses",  path: "/admin/courses/deleted",    icon: TrashIcon      },
  { label: "Leaderboard",      path: "/admin/student/leaderboard",icon: TrophyIcon     },
];

const studentMenu = [
  { label: "Dashboard",     path: "/student/dashboard",  icon: HomeIcon      },
  { label: "Submit Report", path: "/student/report",     icon: ReportIcon    },
  { label: "My Reports",    path: "/student/my-reports", icon: ListIcon      },
  { label: "Leaderboard",   path: "/student/leaderboard",icon: TrophyIcon    },
];

// ── Inline SVG icon components ──────────────────────────────────────────────
function HomeIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function AdminDashIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function StudentsIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="4"/>
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
      <path d="M21 21v-2a4 4 0 00-3-3.87"/>
    </svg>
  );
}
function CoursesIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
function AddPersonIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="8" r="4"/>
      <path d="M2 21v-2a4 4 0 014-4h8a4 4 0 014 4v2"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/>
    </svg>
  );
}
function AddBookIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      <line x1="12" y1="7" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/>
    </svg>
  );
}
function TrashIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}
function TrophyIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8M12 17v4"/>
      <path d="M7 4H4a1 1 0 00-1 1v3a4 4 0 004 4h1"/>
      <path d="M17 4h3a1 1 0 011 1v3a4 4 0 01-4 4h-1"/>
      <path d="M7 4h10v8a5 5 0 01-10 0V4z"/>
    </svg>
  );
}
function ReportIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  );
}
function ListIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <circle cx="3" cy="6" r="1" fill={active ? "#2563eb" : "#9ca3af"}/>
      <circle cx="3" cy="12" r="1" fill={active ? "#2563eb" : "#9ca3af"}/>
      <circle cx="3" cy="18" r="1" fill={active ? "#2563eb" : "#9ca3af"}/>
    </svg>
  );
}
// ────────────────────────────────────────────────────────────────────────────

// Group admin menu items into sections
const adminSections = [
  {
    title: "Overview",
    items: [adminMenu[0]],
  },
  {
    title: "Manage",
    items: [adminMenu[1], adminMenu[2], adminMenu[3], adminMenu[4]],
  },
  {
    title: "Archive",
    items: [adminMenu[5], adminMenu[6]],
  },
  {
    title: "Stats",
    items: [adminMenu[7]],
  },
];

const studentSections = [
  { title: null, items: studentMenu },
];

export default function Sidebar() {
  const [role, setRole] = useState("Student");

  useEffect(() => {
    setRole(isAdmin() ? "Admin" : "Student");
  }, []);

  const sections = role === "Admin" ? adminSections : studentSections;
  const isAdminRole = role === "Admin";

  return (
    <div
      className="w-64 h-screen sticky top-0 flex flex-col overflow-y-auto"
      style={{
        background: "#ffffff",
        borderRight: "1px solid #f1f5f9",
      }}
    >
      {/* Logo / brand header */}
      <div className="px-5 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
        >
          <img
            src="/bcti-logo.jpg"
            alt="BCTI"
            className="h-full w-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<span style="font-size:16px;font-weight:700;color:#2563eb">B</span>';
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
            {isAdminRole ? "BCTI Admin" : "BCTI Student"}
          </p>
          <p className="text-xs text-gray-400 leading-tight mt-0.5">
            {isAdminRole ? "Management Portal" : "Student Portal"}
          </p>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 pt-4 pb-2">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            background: isAdminRole ? "#fef3c7" : "#eff6ff",
            color: isAdminRole ? "#92400e" : "#1d4ed8",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isAdminRole ? "#f59e0b" : "#3b82f6" }}
          />
          {isAdminRole ? "Administrator" : "Student"}
        </span>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-3 pb-6 pt-2 space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <p
                className="px-3 mb-1.5 text-xs font-semibold tracking-widest uppercase"
                style={{ color: "#cbd5e1" }}
              >
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    className="block"
                  >
                    {({ isActive }) => (
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor: isActive ? "#eff6ff" : "transparent",
                        }}
                        whileHover={{ backgroundColor: isActive ? "#eff6ff" : "#f8fafc" }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl relative"
                      >
                        {/* Active left accent */}
                        {isActive && (
                          <motion.div
                            layoutId="activeBar"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                            style={{ background: "#2563eb" }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}

                        {/* Icon */}
                        <span className="flex-shrink-0 ml-1">
                          <IconComponent active={isActive} />
                        </span>

                        {/* Label */}
                        <span
                          className="text-sm font-medium leading-none"
                          style={{ color: isActive ? "#1d4ed8" : "#64748b" }}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ borderTop: "1px solid #f1f5f9" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
        >
          {isAdminRole ? "A" : "S"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">
            {isAdminRole ? "Admin User" : "Student"}
          </p>
          <p className="text-xs text-gray-400 truncate">BCTI Portal</p>
        </div>
      </div>
    </div>
  );
}