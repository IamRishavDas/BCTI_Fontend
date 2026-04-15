// src/components/student/TypingProgress.jsx
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { showError } from "../../utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import { BothIcon, SpeedIcon, TargetIcon } from "../../static/Svg";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function TypingProgress() {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState("speed"); // 'speed', 'accuracy', 'both'
  const [showStats, setShowStats] = useState(true);
  const [timeRange, setTimeRange] = useState("all"); // 'all', 'recent', 'week'

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
        showError(res.message || res.Message || "Failed to load typing progress");
      }
    } catch (err) {
      showError("Unable to load your typing history");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    if (!scores || !scores.typingSpeed) return { speed: [], accuracy: [] };
    
    const { typingSpeed, typingAccuracy } = scores;
    let speed = [...typingSpeed];
    let accuracy = [...typingAccuracy];

    if (timeRange === "recent") {
      speed = speed.slice(-10);
      accuracy = accuracy.slice(-10);
    } else if (timeRange === "week") {
      speed = speed.slice(-7);
      accuracy = accuracy.slice(-7);
    }

    return { speed, accuracy };
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return { avg: 0, max: 0, min: 0, trend: 0 };
    
    const avg = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
    const max = Math.max(...data);
    const min = Math.min(...data);
    
    // Calculate trend (comparing first half vs second half)
    const mid = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalf = data.slice(mid).reduce((a, b) => a + b, 0) / (data.length - mid);
    const trend = ((secondHalf - firstHalf) / firstHalf) * 100;
    
    return { avg, max, min, trend };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="h-80 bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scores || !scores.typingSpeed || scores.typingSpeed.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              Typing Progress
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Track your speed and accuracy over time
            </p>
          </motion.div>

          <motion.div 
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-12 text-center border border-gray-100"
          >
            <div className="text-6xl mb-4">⌨️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Typing Data Yet</h3>
            <p className="text-gray-500">Complete some typing sessions to see your progress graph here.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const { speed: speedData, accuracy: accuracyData } = getFilteredData();
  const speedStats = calculateStats(speedData);
  const accuracyStats = calculateStats(accuracyData);

  const maxSpeed = Math.max(...speedData, 1);
  const maxAccuracy = Math.max(...accuracyData, 1);

  return (
    <div className="min-h-screen bg-gray-50/60 -m-8 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Typing Progress
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Track your speed and accuracy over time
              </p>
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {speedData.length} sessions recorded
            </span>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          variants={fadeUp} 
          custom={1} 
          initial="hidden" 
          animate="visible"
          className="flex flex-wrap items-center gap-3"
        >
          {/* Time Range Filter */}
          <div className="flex bg-white rounded-xl p-1 border border-gray-200">
            {["all", "recent", "week"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  timeRange === range
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range === "all" ? "All Time" : range === "recent" ? "Last 10" : "Last 7"}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl p-1 border border-gray-200">
            {[
              { mode: "speed", icon: <SpeedIcon/>, label: "Speed" },
              { mode: "accuracy", icon: <TargetIcon/>, label: "Accuracy" },
              { mode: "both", icon: <BothIcon/>, label: "Both" }
            ].map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === mode
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Stats Toggle */}
          <button
            onClick={() => setShowStats(!showStats)}
            className="cursor-pointer ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200"
          >
            {showStats ? "Hide" : "Show"} Stats
            <span className="transform transition-transform" style={{ transform: showStats ? "rotate(180deg)" : "rotate(0deg)" }}>
              ▼
            </span>
          </button>
        </motion.div>

        {/* Stats Overview */}
        <AnimatePresence>
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Avg Speed"
                value={speedStats.avg}
                unit="WPM"
                trend={speedStats.trend}
                color="emerald"
                delay={2}
              />
              <StatCard
                label="Best Speed"
                value={speedStats.max}
                unit="WPM"
                color="blue"
                delay={3}
              />
              <StatCard
                label="Avg Accuracy"
                value={accuracyStats.avg}
                unit="%"
                trend={accuracyStats.trend}
                color="amber"
                delay={4}
              />
              <StatCard
                label="Best Accuracy"
                value={accuracyStats.max}
                unit="%"
                color="emerald"
                delay={5}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Session Details */}
        <AnimatePresence>
          {selectedSession !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  Session {selectedSession + 1} Details
                </h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailItem label="Speed" value={`${speedData[selectedSession]} WPM`} />
                <DetailItem label="Accuracy" value={`${accuracyData[selectedSession]}%`} />
                <DetailItem 
                  label="vs Average" 
                  value={`${(speedData[selectedSession] - speedStats.avg).toFixed(1)} WPM`}
                  positive={speedData[selectedSession] > speedStats.avg}
                />
                <DetailItem 
                  label="Rank" 
                  value={`#${speedData.filter(s => s > speedData[selectedSession]).length + 1}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Graph Section */}
        <motion.div 
          variants={fadeUp} 
          custom={6} 
          initial="hidden" 
          animate="visible"
          className={`grid gap-6 ${viewMode === "both" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}
        >
          {/* Speed Graph */}
          {(viewMode === "speed" || viewMode === "both") && (
            <GraphCard
              title="Typing Speed"
              subtitle="Words per minute over sessions"
              data={speedData}
              max={maxSpeed}
              color="emerald"
              icon=<SpeedIcon/>
              unit="WPM"
              selectedSession={selectedSession}
              onSelectSession={setSelectedSession}
            />
          )}

          {/* Accuracy Graph */}
          {(viewMode === "accuracy" || viewMode === "both") && (
            <GraphCard
              title="Accuracy"
              subtitle="Percentage correct over sessions"
              data={accuracyData}
              max={maxAccuracy}
              color="amber"
              icon=<TargetIcon/>
              unit="%"
              selectedSession={selectedSession}
              onSelectSession={setSelectedSession}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, unit, trend, color, delay }) {
  const colorClasses = {
    emerald: { text: "text-emerald-600" },
    blue: { text: "text-blue-600" },
    amber: { text: "text-amber-600" },
  };

  const c = colorClasses[color] ?? colorClasses.blue;

  return (
    <motion.div
      custom={delay}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl p-5 border border-gray-100 bg-white flex flex-col gap-1"
    >
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`text-3xl font-bold ${c.text}`}>{value}</span>
        {unit && <span className="text-sm text-gray-400 font-medium">{unit}</span>}
      </div>
      {trend !== undefined && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          <span>{trend >= 0 ? "↗" : "↘"}</span>
          {Math.abs(trend).toFixed(1)}% trend
        </p>
      )}
    </motion.div>
  );
}

// Graph Card Component
function GraphCard({ title, subtitle, data, max, color, icon, unit, selectedSession, onSelectSession }) {
  const colorClasses = {
    emerald: { bar: "bg-emerald-500", hover: "hover:bg-emerald-600", text: "text-emerald-600" },
    amber: { bar: "bg-amber-500", hover: "hover:bg-amber-600", text: "text-amber-600" },
  };

  const c = colorClasses[color];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">{icon}</span>
        <div>
          <h3 className={`text-sm font-semibold ${c.text}`}>
            {title}
          </h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      <div className="h-72 flex items-end gap-1.5 bg-gray-50/50 rounded-xl p-4 relative">
        {/* Grid lines */}
        <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 border-dashed" />
          ))}
        </div>

        {/* Bars */}
        {data.map((value, index) => {
          const height = (value / (max || 1)) * 100;
          const isSelected = selectedSession === index;
          
          return (
            <motion.div
              key={index}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: `${height}%`, opacity: 1 }}
              transition={{ delay: index * 0.03, type: "spring", stiffness: 100 }}
              className="flex-1 flex flex-col justify-end items-center group relative cursor-pointer"
              onClick={() => onSelectSession(isSelected ? null : index)}
            >
              <div
                className={`w-full ${c.bar} ${c.hover} rounded-t transition-all relative ${
                  isSelected ? "ring-2 ring-offset-2 ring-blue-600" : ""
                }`}
                style={{ height: `${height}%` }}
              />
              
              <div className="text-[9px] text-gray-400 mt-2 font-mono font-medium">
                {value}
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                <div className="font-medium">Session {index + 1}</div>
                <div className="text-gray-300">{value} {unit}</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Session count */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          {data.length} session{data.length !== 1 ? "s" : ""} • Click bars for details
        </p>
      </div>
    </div>
  );
}

// Detail Item Component
function DetailItem({ label, value, positive }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <p className="text-xs text-gray-500 mb-1 font-medium">{label}</p>
      <p className={`text-base font-bold ${
        positive !== undefined 
          ? positive 
            ? "text-emerald-600" 
            : "text-red-600"
          : "text-gray-800"
      }`}>
        {value}
      </p>
    </div>
  );
}
