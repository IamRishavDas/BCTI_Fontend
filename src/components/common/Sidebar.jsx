import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { label: "All Students", path: "/admin/students", icon: "👨‍🎓" },
  // { label: "Student Lookups", path: "/admin/lookups", icon: "🔍" },
  { label: "All Courses", path: "/admin/courses", icon: "📚" },
  { label: "Add New Student", path: "/admin/students/new", icon: "➕" },
  { label: "Add New Course", path: "/admin/courses/new", icon: "📖" },
  { label: "Deleted Students", path: "/admin/deleted", icon: "🗑️" },
  // { label: "Deleted Courses", path: "/admin/courses/deleted", icon: "🗑️" },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b">
        <img src="/bcti-logo.jpg" alt="BCTI" className="h-10" />
        <div>
          <h1 className="font-semibold text-xl">BCTI Admin</h1>
        </div>
      </div>

      <nav className="mt-8 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-2xl mb-2 text-gray-700 transition-all ${
                isActive ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-100"
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}