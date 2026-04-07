import { createContext, useContext, useState, useCallback } from "react";
import ConfirmModal from "../components/common/ConfirmModal";
import InputModal from "../components/common/InputModal";

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    console.warn("useConfirm called outside ConfirmProvider. Returning dummy functions.");
    return {
      confirm: async () => false,
      promptInput: async () => null,
    };
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({ isOpen: false, config: {} });
  const [inputState, setInputState] = useState({ isOpen: false, config: {} });

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        config: {
          title: options.title || "Are you sure?",
          message: options.message || "This action cannot be undone.",
          confirmText: options.confirmText || "Confirm",
          cancelText: options.cancelText || "Cancel",
          type: options.type || "danger",
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        }
      });
    });
  }, []);

  const promptInput = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setInputState({
        isOpen: true,
        config: {
          title: options.title || "Enter Information",
          message: options.message || "Please provide the information",
          placeholder: options.placeholder || "Enter value",
          confirmText: options.confirmText || "Submit",
          onSubmit: (value) => resolve(value),
          onCancel: () => resolve(null),
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm, promptInput }}>
      {children}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, config: {} })}
        onConfirm={() => {
          confirmState.config.onConfirm?.();
          setConfirmState({ isOpen: false, config: {} });
        }}
        {...confirmState.config}
      />

      <InputModal
        isOpen={inputState.isOpen}
        onClose={() => setInputState({ isOpen: false, config: {} })}
        onSubmit={(value) => {
          inputState.config.onSubmit?.(value);
          setInputState({ isOpen: false, config: {} });
        }}
        {...inputState.config}
      />
    </ConfirmContext.Provider>
  );
};