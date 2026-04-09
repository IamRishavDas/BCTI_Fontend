// src/components/common/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { isAdmin } from "../../utils/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AddBookIcon, AddNoticeIcon, AddPersonIcon, AdminDashIcon, CoursesIcon, HomeIcon, KeyboardIcon, ListIcon, NoticeIcon, ReportIcon, SearchIcon, StudentsIcon, TrashIcon, TrophyIcon } from "../../static/Svg";

const adminMenu = [
  { label: "Dashboard",        path: "/admin/dashboard",          icon: AdminDashIcon  },
  { label: "All Students",     path: "/admin/students",           icon: StudentsIcon   },
  { label: "All Courses",      path: "/admin/courses",            icon: CoursesIcon    },
  { label: "Add Student",      path: "/admin/students/new",       icon: AddPersonIcon  },
  { label: "Add Course",       path: "/admin/courses/new",        icon: AddBookIcon    },
  { label: "Deleted Students", path: "/admin/students/deleted",   icon: TrashIcon      },
  { label: "Deleted Courses",  path: "/admin/courses/deleted",    icon: TrashIcon      },
  { label: "Leaderboard",      path: "/admin/student/leaderboard",icon: TrophyIcon     },
  { label: "Notices",          path: "/admin/notices",            icon: NoticeIcon     },
  { label: "Add Notice",       path: "/admin/notices/new",        icon: AddNoticeIcon  },
  { label: "Search",           path: "/admin/students/search",    icon: SearchIcon  },
];

const studentMenu = [
  { label: "Dashboard",       path: "/student/dashboard",  icon: HomeIcon      },
  { label: "Submit Report",   path: "/student/report",     icon: ReportIcon    },
  { label: "My Reports",      path: "/student/my-reports", icon: ListIcon      },
  { label: "Leaderboard",     path: "/student/leaderboard",icon: TrophyIcon    },
  { label: "Typing Practice", path: "/student/typing",     icon: KeyboardIcon },
];

// Group admin menu items into sections
const adminSections = [
  {
    title: "Overview",
    items: [adminMenu[0], adminMenu[10]],
  },
  {
    title: "Manage",
    items: [adminMenu[1], adminMenu[2], adminMenu[3], adminMenu[4]],
  },
  {
    title: "Stats",
    items: [adminMenu[7]],
  },
  {
    title: "Notice",
    items: [adminMenu[8], adminMenu[9]]
  },
  {
    title: "Archive",
    items: [adminMenu[5], adminMenu[6]],
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