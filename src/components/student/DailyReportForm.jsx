// src/components/student/DailyReportForm.jsx
import { useState } from "react";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

export default function DailyReportForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    typingSpeed: "",
    typingAccuracy: "",
    activityName: "",
    activityDescription: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      reportDate: form.reportDate,
      typingSpeed: parseInt(form.typingSpeed),
      typingAccuracy: parseInt(form.typingAccuracy),
      activityName: form.activityName,
      activityDescription: form.activityDescription,
    };

    const res = await api.createDailyReport(payload);

    if (res.success) {
      showSuccess("Daily report submitted successfully!");
      navigate("/student/my-reports");
    } else {
      showError(res.message || "Failed to submit report");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-semibold mb-8">Submit Daily Typing Report</h1>

      <div className="bg-white rounded-3xl shadow-xl p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Report Date</label>
            <input
              type="date"
              value={form.reportDate}
              onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
              className="w-full px-5 py-4 border rounded-2xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Typing Speed (WPM)</label>
              <input
                type="number"
                value={form.typingSpeed}
                onChange={(e) => setForm({ ...form, typingSpeed: e.target.value })}
                className="w-full px-5 py-4 border rounded-2xl"
                placeholder="e.g. 65"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Typing Accuracy (%)</label>
              <input
                type="number"
                value={form.typingAccuracy}
                onChange={(e) => setForm({ ...form, typingAccuracy: e.target.value })}
                className="w-full px-5 py-4 border rounded-2xl"
                placeholder="e.g. 92"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Activity Name</label>
            <input
              type="text"
              value={form.activityName}
              onChange={(e) => setForm({ ...form, activityName: e.target.value })}
              className="w-full px-5 py-4 border rounded-2xl"
              placeholder="e.g. Paragraph Practice"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Activity Description</label>
            <textarea
              value={form.activityDescription}
              onChange={(e) => setForm({ ...form, activityDescription: e.target.value })}
              className="w-full px-5 py-4 border rounded-2xl h-32"
              placeholder="Describe what you practiced today..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Daily Report"}
          </button>
        </form>
      </div>
    </div>
  );
}