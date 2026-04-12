// src/components/shared/TimeInput.jsx
import { useState, useRef, useEffect } from "react";
import ClockPicker from "./ClockPicker";

function formatDisplay(val) {
  if (!val) return null;
  const [h, m] = val.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export default function TimeInput({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`border border-gray-300 rounded-lg px-3 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all w-36 text-left flex items-center justify-between gap-2 ${className}`}
      >
        <span className={value ? "text-gray-800 font-mono" : "text-gray-400"}>
          {value ? formatDisplay(value) : "No class"}
        </span>
        <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-200 hover:bg-red-100 hover:text-red-500 rounded-full text-gray-500 flex items-center justify-center text-xs transition-colors"
        >
          ✕
        </button>
      )}

      {open && (
        <div className="absolute z-50 mt-1 right-0">
          <ClockPicker
            value={value}
            onChange={(v) => { onChange(v); setOpen(false); }}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}