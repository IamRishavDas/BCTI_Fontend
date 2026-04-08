import { createContext, useContext, useState, useCallback } from "react";
import ConfirmModal from "../components/common/ConfirmModal";
import InputModal from "../components/common/InputModal";

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
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
      const handleConfirm = () => {
        resolve(true);
        setConfirmState({ isOpen: false, config: {} });  
      };

      const handleCancel = () => {
        resolve(false);
        setConfirmState({ isOpen: false, config: {} });  
      };

      setConfirmState({
        isOpen: true,
        config: {
          title: options.title || "Are you sure?",
          message: options.message || "This action cannot be undone.",
          confirmText: options.confirmText || "Confirm",
          cancelText: options.cancelText || "Cancel",
          type: options.type || "danger",
          onConfirm: handleConfirm,     
          onCancel: handleCancel,        
        }
      });
    });
  }, []);

  const promptInput = useCallback((options = {}) => {
    return new Promise((resolve) => {
      const handleSubmit = (value) => {
        resolve(value);
        setInputState({ isOpen: false, config: {} });     
      };

      const handleCancel = () => {
        resolve(null);
        setInputState({ isOpen: false, config: {} });     
      };

      setInputState({
        isOpen: true,
        config: {
          title: options.title || "Enter Information",
          message: options.message || "Please provide the information",
          placeholder: options.placeholder || "Enter value",
          confirmText: options.confirmText || "Submit",
          onSubmit: handleSubmit,      // ← Changed
          onCancel: handleCancel,      // ← Changed
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm, promptInput }}>
      {children}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => {
          confirmState.config.onCancel?.();           
        }}
        onConfirm={() => {
          confirmState.config.onConfirm?.();          
        }}
        {...confirmState.config}
      />

      <InputModal
        isOpen={inputState.isOpen}
        onClose={() => {
          inputState.config.onCancel?.();             
        }}
        onSubmit={(value) => {
          inputState.config.onSubmit?.(value);        
        }}
        {...inputState.config}
      />
    </ConfirmContext.Provider>
  );
};