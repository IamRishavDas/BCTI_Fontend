import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function InputModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Enter Details",
  message = "Please provide the required information",
  placeholder = "Enter value",
  confirmText = "Submit",
  cancelText = "Cancel",
  type = "info"
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <div className="border-t border-gray-100 px-8 py-6 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 border-2 border-gray-300 hover:bg-gray-50 font-medium rounded-2xl"
            >
              {cancelText}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="flex-1 py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold rounded-2xl transition-all"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}