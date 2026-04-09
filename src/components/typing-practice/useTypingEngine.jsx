import { useState, useEffect, useRef, useCallback } from "react";
import { DURATION_SECONDS } from "./typingPresets";

export function useTypingEngine(targetText) {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  // Compute per-character state
  const charStates = targetText.split("").map((ch, i) => {
    if (i >= input.length) return "pending";
    return input[i] === ch ? "correct" : "incorrect";
  });

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
      setCorrectChars(correct);
      setIncorrectChars(incorrect);
      const totalTyped = currentInput.length;
      const acc = totalTyped === 0 ? 100 : Math.round((correct / totalTyped) * 100);
      setAccuracy(acc);

      // WPM = (correct characters / 5) / minutes elapsed
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
        const calculatedWpm = elapsed > 0 ? Math.round(correct / 5 / elapsed) : 0;
        setWpm(calculatedWpm);
      }
    },
    [targetText]
  );

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
              setFinished(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      // Don't allow typing beyond text length
      if (value.length > targetText.length) return;
      setInput(value);
      computeStats(value);

      // Finished if all chars typed
      if (value.length === targetText.length) {
        clearInterval(intervalRef.current);
        setFinished(true);
      }
    },
    [finished, started, targetText, computeStats]
  );

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
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Reset when targetText changes
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