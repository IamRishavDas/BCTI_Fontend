// src/components/student/MyReports.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await api.getMyReports();
    if (res.success) {
      setReports(res.data || []);
    } else {
      showError("Failed to load your reports");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">My Typing Reports</h1>

      <div className="bg-white rounded-3xl shadow overflow-hidden">
        {loading ? (
          <p className="p-12 text-center">Loading your reports...</p>
        ) : reports.length === 0 ? (
          <p className="p-12 text-center text-gray-500">No reports found. Start submitting daily reports!</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-8 py-5">Date</th>
                <th className="text-left px-8 py-5">Activity</th>
                <th className="text-center px-8 py-5">Speed (WPM)</th>
                <th className="text-center px-8 py-5">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="border-t hover:bg-blue-50">
                  <td className="px-8 py-6">{new Date(report.reportDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-8 py-6">
                    <div className="font-medium">{report.activityName}</div>
                    <div className="text-sm text-gray-500">{report.activityDescription}</div>
                  </td>
                  <td className="px-8 py-6 text-center font-semibold text-emerald-600">{report.typingSpeed}</td>
                  <td className="px-8 py-6 text-center font-semibold text-amber-600">{report.typingAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}