// src/components/Navbar.jsx
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConfirm } from "../contexts/ConfirmContext";
import { showSuccess, showError } from "../utils/toast";
import { api } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { promptInput } = useConfirm();     // ← Now it will work
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      if (location.pathname === "/" && token) {
        localStorage.clear();
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleChangePassword = async () => {
    try {
      const currentPassword = await promptInput({
        title: "Change Password",
        message: "Enter your current password",
        placeholder: "Current Password",
        confirmText: "Next",
      });

      if (!currentPassword) return;

      const newPassword = await promptInput({
        title: "Change Password",
        message: "Enter your new password",
        placeholder: "New Password",
        confirmText: "Change Password",
      });

      if (!newPassword) return;

      const res = await api.changePassword(currentPassword, newPassword);

      if (res.success) {
        showSuccess("Password changed successfully!");
      } else {
        showError(res.message || res.Message || "Failed to change password");
      }
    } catch (error) {
      console.log(error);
      showError("Something went wrong. Please try again.");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/bcti-logo.jpg" alt="BCTI Logo" className="h-12 w-auto object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">BCTI</h1>
            <p className="text-xs text-gray-500 -mt-1">Computer Training Institute</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangePassword}
              className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
            >
              Change Password
            </motion.button>
          )}

          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition-all shadow-lg"
            >
              Logout
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-2xl transition-all shadow-lg"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}