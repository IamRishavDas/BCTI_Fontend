import { motion } from "framer-motion";


export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: { icon: "⚠️", confirmClass: "bg-red-600 hover:bg-red-700", titleClass: "text-red-600" },
    warning: { icon: "⚠️", confirmClass: "bg-amber-600 hover:bg-amber-700", titleClass: "text-amber-600" },
    info: { icon: "ℹ️", confirmClass: "bg-blue-600 hover:bg-blue-700", titleClass: "text-blue-600" },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="text-5xl mb-6">{style.icon}</div>
          <h2 className={`text-2xl font-semibold mb-3 ${style.titleClass}`}>{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="border-t px-8 py-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 border-2 border-gray-300 hover:bg-gray-50 font-medium rounded-2xl cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 font-semibold rounded-2xl cursor-pointer ${style.confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}