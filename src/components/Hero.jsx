import { motion } from "framer-motion";
import Notice from "./Notice";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center pt-0">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-26 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7 space-y-8"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Established 2008 · Bhadreswar, WB
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold leading-none text-gray-900 tracking-tight">
            Bhadreswar
            <br />
            <span className="text-blue-700">Computer &</span>
            <br />
            Technical Institute
          </h1>

          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            Focused computer training courses with expert faculty support.
            Building careers in technology since 2008.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open("tel:+918420029222", "_self")}
              className="cursor-pointer px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl shadow-md shadow-blue-200 transition-all text-sm"
            >
              Contact Us
            </motion.button>

            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-700 font-semibold rounded-2xl transition-all text-sm"
            >
              View Courses
            </motion.button> */}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-8 pt-2"
          >
            {[
              { value: "15+", label: "Years Active" },
              { value: "10+", label: "Courses" },
              { value: "1000+", label: "Students" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Notice Panel */}
        <Notice />
      </div>
    </section>
  );
}