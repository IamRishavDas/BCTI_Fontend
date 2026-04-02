// src/hooks/useConfirm.js
import { useState, useCallback } from "react";

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({});

  const confirm = useCallback((options) => {
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

  return {
    isOpen,
    config,
    confirm,
    handleClose,
    handleConfirm,
  };
};