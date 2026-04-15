import { AnimatePresence, motion } from "framer-motion";

const typeConfig = {
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    titleColor: "text-gray-900",
    badgeBg: "bg-red-50",
    badgeText: "text-red-600",
    confirmBg: "bg-red-600 hover:bg-red-700 active:bg-red-800",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    titleColor: "text-gray-900",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    confirmBg: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  info: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    titleColor: "text-gray-900",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    confirmBg: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}) {
  if (!isOpen) return null;

  const config = typeConfig[type] ?? typeConfig.danger;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="confirm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={handleBackdrop}
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          key="confirm-panel"
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

            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-base font-semibold ${config.titleColor}`}>{title}</h2>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
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
              onClick={() => { onConfirm(); onClose(); }}
              className={`cursor-pointer flex-1 h-10 text-sm font-semibold text-white rounded-xl transition-all ${config.confirmBg}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}