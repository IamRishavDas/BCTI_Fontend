import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRESETS } from "./TypingPresets";
import { useTypingEngine } from "./useTypingEngine";
import TimerDisplay from "./TimerDisplay";
import StatsBar from "./StatsBar";
import TextDisplay from "./TextDisplay";
import PresetSelector from "./PresetSelector";
import ResultsModal from "./ResultsModal";

import { api } from "../../services/api";
import { showSuccess, showError } from "../../utils/toast";

import TypingHistoryModal from "../student/TypingHistoryModal";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: "easeOut" },
  }),
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TypingPractice() {
  const [activePresetId, setActivePresetId] = useState(PRESETS[0].id);
  const [targetText, setTargetText] = useState(() =>
    pickRandom(PRESETS[0].paragraphs)
  );
  const [resetKey, setResetKey] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);   // ← New state

  const inputRef = useRef(null);

  const {
    input,
    started,
    finished,
    timeLeft,
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    charStates,
    handleInput,
    reset,
  } = useTypingEngine(targetText);

  // Auto upload once when test finishes
  useEffect(() => {
    const submitTypingReport = async () => {
      if (!finished || hasSubmitted) return;

      setHasSubmitted(true);

      const payload = {
        wpm: Math.round(wpm || 0),
        correct: correctChars || 0,
        wrong: incorrectChars || 0,
      };

      try {
        const result = await api.createTypingReport(payload);
        if (result?.success) {
          showSuccess("Typing report saved successfully!");
        } else {
          showError(result?.message || result?.Message || "Failed to save typing report");
        }
      } catch (error) {
        console.error("Failed to save typing report:", error);
        showError("Failed to save your typing score.");
      }
    };

    if (finished) {
      submitTypingReport();
    }
  }, [finished, wpm, correctChars, incorrectChars, hasSubmitted]);

  const handlePresetChange = useCallback((id) => {
    setActivePresetId(id);
    const preset = PRESETS.find((p) => p.id === id);
    setTargetText(pickRandom(preset.paragraphs));
    setResetKey((k) => k + 1);
    setHasSubmitted(false);
  }, []);

  const handleNewParagraph = useCallback(() => {
    const preset = PRESETS.find((p) => p.id === activePresetId);
    setTargetText(pickRandom(preset.paragraphs));
    setResetKey((k) => k + 1);
    setHasSubmitted(false);
  }, [activePresetId]);

  const handleCloseModal = useCallback(() => {
    window.location.reload();
  }, []);

  const handleRetry = useCallback(() => {
    reset();
    setResetKey((k) => k + 1);
    setHasSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [reset]);

  const handleNewAndReset = useCallback(() => {
    handleNewParagraph();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [handleNewParagraph]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [resetKey]);

  const progressPct =
    targetText.length > 0 ? (input.length / targetText.length) * 100 : 0;

  return (
    <div className="min-h-screen overflow-hidden p-1" style={{ background: "#f8fafc" }}>

      {/* Results Modal */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ResultsModal
              wpm={wpm}
              accuracy={accuracy}
              correctChars={correctChars}
              incorrectChars={incorrectChars}
              timeLeft={timeLeft}
              onRetry={handleRetry}
              onNew={handleNewAndReset}
              onClose={handleCloseModal}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Typing History Modal */}
      <TypingHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate="visible"
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Typing Practice</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>
              10-minute typing session
            </p>
          </div>

          <div
            className="rounded-2xl p-1 flex items-center justify-center"
            style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
          >
            <TimerDisplay timeLeft={timeLeft} started={started} finished={finished} />
          </div>

          <div className="flex items-center gap-3">
            {/* New Button - View History */}
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all bg-white border border-gray-200 hover:border-gray-300"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg> 
              View History
            </button>

            <button
              onClick={handleRetry}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset
            </button>
          </div>
        </motion.div>

        {/* Rest of your components remain exactly the same */}
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <StatsBar
            wpm={wpm}
            accuracy={accuracy}
            correctChars={correctChars}
            incorrectChars={incorrectChars}
          />
        </motion.div>

        <motion.div
          variants={fadeUp} custom={2} initial="hidden" animate="visible"
          className="rounded-2xl p-1 flex flex-col gap-3"
          style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#cbd5e1" }}>
              Category
            </p>
            <button
              onClick={handleNewAndReset}
              className="cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-colors"
              style={{ color: "#2563eb" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              New Paragraph
            </button>
          </div>
          <PresetSelector
            presets={PRESETS}
            activePresetId={activePresetId}
            onSelect={handlePresetChange}
          />
        </motion.div>

        <motion.div
          key={resetKey}
          variants={fadeUp} custom={3} initial="hidden" animate="visible"
          className="rounded-2xl p-2 flex flex-col gap-4"
          style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
        >
          <TextDisplay
            targetText={targetText}
            charStates={charStates}
            currentIndex={input.length}
          />

          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#2563eb" }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-lg font-mono resize-none focus:outline-none transition-all"
            style={{
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              color: "#1e293b",
              minHeight: "80px",
              caretColor: "#2563eb",
            }}
            onFocus={(e) => (e.target.style.border = "1.5px solid #2563eb")}
            onBlur={(e) => (e.target.style.border = "1.5px solid #e2e8f0")}
            placeholder="Click here and start typing..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          <p className="text-xs text-center" style={{ color: "#429CEB" }}>
            {input.length} / {targetText.length} characters
          </p>
        </motion.div>

      </div>
    </div>
  );
}