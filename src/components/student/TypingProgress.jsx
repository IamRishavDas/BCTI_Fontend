// src/components/student/TypingProgress.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import { motion } from "framer-motion";

export default function TypingProgress() {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTypingScores();
  }, []);

  const fetchTypingScores = async () => {
    setLoading(true);
    try {
      const res = await api.getMyTypingScores();
      if (res.success && res.data) {
        setScores(res.data);
      } else {
        showError(res.message || "Failed to load typing progress");
      }
    } catch (err) {
      showError("Unable to load your typing history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow border border-gray-100">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!scores || !scores.typingSpeed || scores.typingSpeed.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Typing Data Yet</h3>
        <p className="text-gray-500">Complete some typing sessions to see your progress graph here.</p>
      </div>
    );
  }

  const speedData = scores.typingSpeed;
  const accuracyData = scores.typingAccuracy;
  const labels = Array.from({ length: speedData.length }, (_, i) => `Session ${i + 1}`);

  const maxSpeed = Math.max(...speedData);
  const maxAccuracy = Math.max(...accuracyData);

  return (
    <div className="bg-white rounded-3xl p-8 shadow border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Typing Progress</h2>
          <p className="text-sm text-gray-500 mt-1">Your recent typing sessions</p>
        </div>
        <div className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
          Last {speedData.length} sessions
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Speed Graph */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
            <span className="text-emerald-600">●</span> Typing Speed (WPM)
          </h3>
          <div className="h-64 flex items-end gap-2 bg-gray-50 rounded-2xl p-4">
            {speedData.map((speed, index) => {
              const height = (speed / (maxSpeed || 1)) * 100;
              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-1 flex flex-col justify-end items-center group relative"
                >
                  <div className="w-full bg-emerald-500 rounded-t transition-all group-hover:bg-emerald-600"
                       style={{ height: `${height}%` }} />
                  <div className="text-[10px] text-gray-400 mt-2 font-mono">{speed}</div>
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-all text-xs bg-black text-white px-2 py-1 rounded">
                    {speed} WPM
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Accuracy Graph */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
            <span className="text-amber-600">●</span> Accuracy (%)
          </h3>
          <div className="h-64 flex items-end gap-2 bg-gray-50 rounded-2xl p-4">
            {accuracyData.map((acc, index) => {
              const height = (acc / (maxAccuracy || 1)) * 100;
              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-1 flex flex-col justify-end items-center group relative"
                >
                  <div className="w-full bg-amber-500 rounded-t transition-all group-hover:bg-amber-600"
                       style={{ height: `${height}%` }} />
                  <div className="text-[10px] text-gray-400 mt-2 font-mono">{acc}</div>
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-all text-xs bg-black text-white px-2 py-1 rounded">
                    {acc}%
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
        <div className="bg-emerald-50 rounded-2xl p-5">
          <p className="text-xs text-emerald-600 font-medium">BEST SPEED</p>
          <p className="text-4xl font-bold text-emerald-700 mt-2">
            {Math.max(...speedData)} <span className="text-lg font-normal">WPM</span>
          </p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-5">
          <p className="text-xs text-amber-600 font-medium">BEST ACCURACY</p>
          <p className="text-4xl font-bold text-amber-700 mt-2">
            {Math.max(...accuracyData)}%
          </p>
        </div>
      </div>
    </div>
  );
}