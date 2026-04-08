import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const typeConfig = {
  info: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    focusRing: "focus:border-blue-500 focus:ring-blue-100",
    confirmBg: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 disabled:text-blue-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    focusRing: "focus:border-amber-400 focus:ring-amber-100",
    confirmBg: "bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:text-amber-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    focusRing: "focus:border-red-400 focus:ring-red-100",
    confirmBg: "bg-red-600 hover:bg-red-700 disabled:bg-red-200 disabled:text-red-400",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
};

export default function InputModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter details",
  message = "Please provide the required information.",
  placeholder = "Enter value",
  confirmText = "Submit",
  cancelText = "Cancel",
  maxLength,
  type = "info",
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const config = typeConfig[type] ?? typeConfig.info;

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue("");
      onClose();
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="input-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={handleBackdrop}
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            key="input-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${config.iconBg} ${config.iconColor}`}>
                {config.icon}
              </div>

              <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{message}</p>

              <div className="relative mt-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  className={`w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl outline-none ring-2 ring-transparent transition-all ${config.focusRing}`}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{ fontFamily: "inherit" }}
                />
                {maxLength && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none tabular-nums">
                    {inputValue.length}/{maxLength}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex gap-2.5">
              <button
                onClick={onClose}
                className="cursor-pointer flex-1 h-10 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-150 rounded-xl transition-colors border border-gray-200"
              >
                {cancelText}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className={`cursor-pointer flex-1 h-10 text-sm font-semibold text-white rounded-xl transition-all ${config.confirmBg}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}