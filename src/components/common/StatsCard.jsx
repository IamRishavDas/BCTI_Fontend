import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl border p-8 shadow-sm ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-4xl font-semibold mt-3 text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
        </div>
        <div className="text-5xl opacity-80">{icon}</div>
      </div>
    </motion.div>
  );
}