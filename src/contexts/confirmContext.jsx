import { createContext, useContext, useState, useCallback } from "react";
import ConfirmModal from "../components/common/ConfirmModal";

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfig({
        title: options.title || "Are you sure?",
        message: options.message || "This action cannot be undone.",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        type: options.type || "danger",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
      setIsOpen(true);
    });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    config.onCancel?.();
  };

  const handleConfirm = () => {
    config.onConfirm?.();
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Global Modal */}
      <ConfirmModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        type={config.type}
      />
    </ConfirmContext.Provider>
  );
};