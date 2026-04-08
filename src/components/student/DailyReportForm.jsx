// src/components/student/DailyReportForm.jsx
import { useState } from "react";
import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { getTodayDate } from "../../utils/shared";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.32, delay: i * 0.06, ease: "easeOut" },
  }),
};

function FieldLabel({ children, htmlFor, hint }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700">
        {children}
      </label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
  );
}

function InputWrapper({ children }) {
  return <div className="relative">{children}</div>;
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 hover:border-gray-300 transition-all";

export default function DailyReportForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reportDate:          new Date().toISOString().split("T")[0],
    typingSpeed:         "",
    typingAccuracy:      "",
    activityName:        "",
    activityDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!form.typingSpeed || isNaN(form.typingSpeed) || +form.typingSpeed < 1)
      e.typingSpeed = "Enter a valid speed (≥ 1 WPM)";
    if (!form.typingAccuracy || +form.typingAccuracy < 1 || +form.typingAccuracy > 100)
      e.typingAccuracy = "Accuracy must be 1–100%";
    if (!form.activityName.trim())
      e.activityName = "Activity name is required";
    return e;
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const res = await api.createDailyReport({
      reportDate:          form.reportDate,
      typingSpeed:         parseInt(form.typingSpeed),
      typingAccuracy:      parseInt(form.typingAccuracy),
      activityName:        form.activityName,
      activityDescription: form.activityDescription,
    });

    if (res.success) {
      showSuccess("Daily report submitted!");
      navigate("/student/my-reports");
    } else {
      showError(res.message || "Failed to submit report");
    }
    setLoading(false);
  };

  const speedVal    = parseInt(form.typingSpeed)   || 0;
  const accuracyVal = parseInt(form.typingAccuracy) || 0;
  const isReadyToPreview = speedVal > 0 && accuracyVal > 0;

  return (
    <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Submit daily report</h1>
          <p className="text-gray-500 mt-1 text-sm">Log your typing session for today</p>
        </motion.div>

        {/* Live preview pill */}
        {isReadyToPreview && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-gray-600">
              Preview:{" "}
              <span className="font-semibold text-emerald-700">{speedVal} WPM</span>
              {" "}at{" "}
              <span className={`font-semibold ${accuracyVal >= 90 ? "text-emerald-700" : accuracyVal >= 70 ? "text-amber-700" : "text-red-600"}`}>
                {accuracyVal}% accuracy
              </span>
              {" "}—{" "}
              <span className="text-gray-400 text-xs">
                {speedVal >= 60 ? "Fast" : speedVal >= 35 ? "Average" : "Needs work"}
              </span>
            </span>
          </motion.div>
        )}

        {/* Form card */}
        <motion.div
          variants={fadeUp} custom={1} initial="hidden" animate="visible"
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-6 space-y-5">

              {/* Date */}
              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                <FieldLabel htmlFor="reportDate">Report date</FieldLabel>
                <input
                  id="reportDate"
                  type="date"
                  value={form.reportDate}
                  onChange={set("reportDate")}
                  max={getTodayDate()}
                  required
                  className={inputCls}
                />
              </motion.div>

              {/* Speed + Accuracy row */}
              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <FieldLabel htmlFor="typingSpeed" hint="words/min">Typing speed</FieldLabel>
                  <InputWrapper>
                    <input
                      id="typingSpeed"
                      type="number"
                      min="1"
                      max="150"
                      value={form.typingSpeed}
                      onChange={set("typingSpeed")}
                      placeholder="65"
                      required
                      className={`${inputCls} ${errors.typingSpeed ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                    />
                  </InputWrapper>
                  {errors.typingSpeed && (
                    <p className="text-xs text-red-500 mt-1">{errors.typingSpeed}</p>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="typingAccuracy" hint="1–100">Accuracy</FieldLabel>
                  <InputWrapper>
                    <input
                      id="typingAccuracy"
                      type="number"
                      min="1"
                      max="100"
                      value={form.typingAccuracy}
                      onChange={set("typingAccuracy")}
                      placeholder="92"
                      required
                      className={`${inputCls} ${errors.typingAccuracy ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                    />
                  </InputWrapper>
                  {errors.typingAccuracy && (
                    <p className="text-xs text-red-500 mt-1">{errors.typingAccuracy}</p>
                  )}
                </div>
              </motion.div>

              {/* Activity name */}
              <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                <FieldLabel htmlFor="activityName">Activity name</FieldLabel>
                <input
                  id="activityName"
                  type="text"
                  value={form.activityName}
                  onChange={set("activityName")}
                  placeholder="e.g. Paragraph practice"
                  required
                  className={`${inputCls} ${errors.activityName ? "border-red-300 focus:border-red-400 focus:ring-red-500/20" : ""}`}
                />
                {errors.activityName && (
                  <p className="text-xs text-red-500 mt-1">{errors.activityName}</p>
                )}
              </motion.div>

              {/* Description */}
              <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                <FieldLabel htmlFor="activityDescription" hint="Optional">Description</FieldLabel>
                <textarea
                  id="activityDescription"
                  value={form.activityDescription}
                  onChange={set("activityDescription")}
                  placeholder="Describe what you practiced today…"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </motion.div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl border border-gray-200 hover:bg-white hover:border-gray-300 active:scale-95 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit report
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}