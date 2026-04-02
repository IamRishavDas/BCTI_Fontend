// src/utils/toast.js
import { toast } from 'react-toastify';

const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  style: {
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    fontSize: "15px",
  }
};

export const showSuccess = (message) => {
  toast.success(message, {
    ...toastConfig,
    style: { 
      ...toastConfig.style, 
      background: "#f0fdf4", 
      color: "#166534",
      border: "1px solid #86efac"
    },
    icon: "✅"
  });
};

export const showError = (message) => {
  toast.error(message, {
    ...toastConfig,
    style: { 
      ...toastConfig.style, 
      background: "#fef2f2", 
      color: "#991b1b",
      border: "1px solid #fca5a5"
    },
    icon: "❌"
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    ...toastConfig,
    style: { 
      ...toastConfig.style, 
      background: "#eff6ff", 
      color: "#1e40af",
      border: "1px solid #93c5fd"
    },
    icon: "ℹ️"
  });
};

export const showWarning = (message) => {
  toast.warning(message, toastConfig);
};