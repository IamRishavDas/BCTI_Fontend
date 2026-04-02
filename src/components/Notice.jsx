import { motion } from "framer-motion";

export default function Notice() {

    const notices = [
    {
      id: 1,
      title: "New Batch Starting: Full Stack Web Development",
      date: "April 10, 2026",
      description: "Limited seats available. Register before March 25.",
    }
  ];

  return (
    <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="md:col-span-5"
        >
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
            {/* Notices Header */}
            <div className="bg-blue-700 text-white px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-xl">📢</div>
                <h2 className="text-2xl font-semibold tracking-tight">Latest Notices</h2>
              </div>
              <span className="text-sm bg-white/20 px-4 py-1 rounded-full">Updated Today</span>
            </div>

            {/* Notices List */}
            <div className="divide-y divide-gray-100">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="px-8 py-7 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight pr-4">
                      {notice.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-full">
                      {notice.date}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[15px] leading-relaxed mt-2">
                    {notice.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
  )
}
