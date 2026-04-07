// src/components/student/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    setLoading(true);

    try {
      // Fetch only first page with 4 items for dashboard
      const result = await api.getMyReports(1, 4);

      if (result.data?.success) {
        setMyReports(result.data.data || []);
        setTotalReports(result.data.data?.length || 0); // fallback, or use metadata if available
      } else {
        showError(result.data?.message || "Failed to load your reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      showError("Unable to load your reports");
    } finally {
      setLoading(false);
    }
  };

  const latestReport = myReports.length > 0 ? myReports[0] : null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-semibold text-gray-900">Welcome back, Student</h1>
        <p className="text-gray-600 mt-2">Track your typing progress at BCTI</p>
      </div>

      {/* Welcome Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow"
        >
          <p className="text-gray-500 text-sm">Total Reports Submitted</p>
          <p className="text-5xl font-bold text-blue-600 mt-3">{totalReports}</p>
        </motion.div>

        {latestReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow"
          >
            <p className="text-gray-500 text-sm">Latest Typing Speed</p>
            <p className="text-5xl font-bold text-emerald-600 mt-3">{latestReport.typingSpeed} WPM</p>
          </motion.div>
        )}

        {latestReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow"
          >
            <p className="text-gray-500 text-sm">Latest Accuracy</p>
            <p className="text-5xl font-bold text-amber-600 mt-3">{latestReport.typingAccuracy}%</p>
          </motion.div>
        )}
      </div>

      {/* Recent Reports - Only Last 4 */}
      <div className="bg-white rounded-3xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Reports</h2>
          <button
            onClick={() => window.location.href = "/student/report"}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
          >
            Submit New Report →
          </button>
        </div>

        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading your recent reports...</p>
        ) : myReports.length > 0 ? (
          <div className="space-y-4">
            {myReports.slice(0, 4).map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center border-b pb-4 last:border-0 hover:bg-gray-50 px-4 py-3 rounded-2xl transition-colors"
              >
                <div>
                  <p className="font-medium">{new Date(report.reportDate).toLocaleDateString('en-IN')}</p>
                  <p className="text-sm text-gray-500">{report.activityName}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 font-semibold text-lg">{report.typingSpeed} WPM</p>
                  <p className="text-amber-600 text-sm">{report.typingAccuracy}% Accuracy</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No reports submitted yet. Start typing today!</p>
        )}
      </div>
    </div>
  );
}