import { useState, useRef, useCallback, useEffect } from "react";
import { DURATION_SECONDS } from "./TypingPresets";

export function useTypingEngine(targetText) {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const intervalRef    = useRef(null);
  const startTimeRef   = useRef(null);
  // Keep a ref to correct char count so the timer tick can read it
  // without needing it in the dependency array
  const correctRef     = useRef(0);

  // ── charStates: derived inline (no state, no stale closure) ──────────
  const charStates = targetText.split("").map((ch, i) => {
    if (i >= input.length) return "pending";
    return input[i] === ch ? "correct" : "incorrect";
  });

  // ── Shared WPM formula ────────────────────────────────────────────────
  // Uses elapsed wall-clock time from first keystroke so idle time is
  // fully accounted for — WPM drifts down the longer you wait.
  function calcWpm(correct) {
    if (!startTimeRef.current) return 0;
    const elapsedMin = (Date.now() - startTimeRef.current) / 60000;
    return elapsedMin > 0 ? Math.round(correct / 5 / elapsedMin) : 0;
  }

  // ── computeStats: called on every keystroke ───────────────────────────
  const computeStats = useCallback(
    (currentInput) => {
      let correct = 0;
      let incorrect = 0;
      for (let i = 0; i < currentInput.length; i++) {
        if (i < targetText.length) {
          if (currentInput[i] === targetText[i]) correct++;
          else incorrect++;
        }
      }
      correctRef.current = correct; // keep ref in sync for timer ticks
      setCorrectChars(correct);
      setIncorrectChars(incorrect);

      const totalTyped = currentInput.length;
      const acc = totalTyped === 0 ? 100 : Math.round((correct / totalTyped) * 100);
      setAccuracy(acc);
      setWpm(calcWpm(correct));
    },
    [targetText]
  );

  // ── handleInput ───────────────────────────────────────────────────────
  const handleInput = useCallback(
    (value) => {
      if (finished) return;

      if (!started) {
        setStarted(true);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              // Recalculate WPM one final time using full elapsed time
              setWpm(calcWpm(correctRef.current));
              setFinished(true);
              return 0;
            }
            // Recalculate WPM on every tick so idle time drags it down live
            setWpm(calcWpm(correctRef.current));
            return prev - 1;
          });
        }, 1000);
      }

      if (value.length > targetText.length) return;
      setInput(value);
      computeStats(value);

      if (value.length === targetText.length) {
        clearInterval(intervalRef.current);
        // Final WPM snapshot at completion moment
        setWpm(calcWpm(correctRef.current));
        setFinished(true);
      }
    },
    [finished, started, targetText, computeStats]
  );

  // ── reset ─────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setInput("");
    setStarted(false);
    setFinished(false);
    setTimeLeft(DURATION_SECONDS);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setIncorrectChars(0);
    startTimeRef.current = null;
    correctRef.current   = 0;
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Reset whenever the target text changes (new paragraph / preset change)
  useEffect(() => {
    reset();
  }, [targetText]); // eslint-disable-line

  return {
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
  };
}