import React, { useState, useRef, useCallback, useEffect } from "react";
import { PRESETS } from "./typingPresets";
import { useTypingEngine } from "./useTypingEngine";
import TimerDisplay from "./TimerDisplay";
import StatsBar from "./StatsBar";
import TextDisplay from "./TextDisplay";
import PresetSelector from "./PresetSelector";
import ResultsModal from "./ResultsModal";

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TypingPractice() {
  const [activePresetId, setActivePresetId] = useState(PRESETS[0].id);
  const [targetText, setTargetText] = useState(() =>
    pickRandom(PRESETS[0].paragraphs)
  );
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

  const handlePresetChange = useCallback((id) => {
    setActivePresetId(id);
    const preset = PRESETS.find((p) => p.id === id);
    setTargetText(pickRandom(preset.paragraphs));
  }, []);

  const handleNewParagraph = useCallback(() => {
    const preset = PRESETS.find((p) => p.id === activePresetId);
    setTargetText(pickRandom(preset.paragraphs));
  }, [activePresetId]);

  const handleRetry = useCallback(() => {
    reset();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [reset]);

  const handleNewAndReset = useCallback(() => {
    handleNewParagraph();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [handleNewParagraph]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const progressPct = targetText.length > 0 ? (input.length / targetText.length) * 100 : 0;

  return (
    <div className="min-h-screen p-6" style={{ background: "#f8fafc" }}>
      {finished && (
        <ResultsModal
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
          timeLeft={timeLeft}
          onRetry={handleRetry}
          onNew={handleNewAndReset}
        />
      )}

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Typing Practice</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>
              10-minute typing session · improve your speed &amp; accuracy
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "#eff6ff",
              color: "#2563eb",
              border: "1px solid #bfdbfe",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        </div>

        {/* Timer */}
        <div
          className="rounded-2xl p-5 flex items-center justify-center"
          style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
        >
          <TimerDisplay timeLeft={timeLeft} started={started} finished={finished} />
        </div>

        {/* Stats */}
        <StatsBar
          wpm={wpm}
          accuracy={accuracy}
          correctChars={correctChars}
          incorrectChars={incorrectChars}
        />

        {/* Preset selector */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#cbd5e1" }}>
              Category
            </p>
            <button
              onClick={handleNewAndReset}
              className="text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
        </div>

        {/* Text display */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "#ffffff", border: "1px solid #f1f5f9" }}
        >
          <TextDisplay
            targetText={targetText}
            charStates={charStates}
            currentIndex={input.length}
          />

          {/* Progress bar */}
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{ width: `${progressPct}%`, background: "#2563eb" }}
            />
          </div>

          {/* Hidden input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm font-mono resize-none focus:outline-none transition-all"
            style={{
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              color: "#1e293b",
              minHeight: "80px",
              caretColor: "#2563eb",
            }}
            onFocus={(e) =>
              (e.target.style.border = "1.5px solid #2563eb")
            }
            onBlur={(e) =>
              (e.target.style.border = "1.5px solid #e2e8f0")
            }
            placeholder="Click here and start typing..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          <p className="text-xs text-center" style={{ color: "#cbd5e1" }}>
            {input.length} / {targetText.length} characters
          </p>
        </div>

        {/* Tips */}
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "#1d4ed8" }}>
            <strong>Tips:</strong> Keep your eyes on the text, not your keyboard. Accuracy matters more than speed — slow down to type correctly. Use all fingers and maintain a relaxed posture.
          </p>
        </div>
      </div>
    </div>
  );
}