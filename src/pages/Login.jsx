// src/components/Login.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import { showSuccess, showError } from "../utils/toast";

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

const inputBase =
  "w-full px-4 py-3 text-sm border rounded-2xl focus:outline-none transition-colors duration-150 bg-white text-gray-800 placeholder-gray-400";

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo: rollNo.trim(), password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("token", result.data);
        const user = getUser();

        if (!user || !user.role) {
          throw new Error("Invalid token data");
        }

        const role = user.role.trim().toLowerCase();

        showSuccess(`Login successful as ${role}`);

        if (role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      } else {
        setError(result.message || result.Message || "Invalid Roll Number or Password");
      }
    } catch (err) {
      // console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "#f8fafc" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors cursor-pointer"
        >
          <ChevronLeftIcon />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow p-10 border border-gray-100">
          {/* Brand */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 overflow-hidden"
              style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <img
                src="/bcti-logo.jpg"
                alt="BCTI"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML =
                    '<span style="font-size:22px;font-weight:700;color:#2563eb">B</span>';
                }}
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-1">
              Sign in to BCTI Computer Training Institute
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Roll No */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                  setError("");
                }}
                placeholder="e.g. BCTI-0012"
                className={
                  inputBase +
                  (error
                    ? " border-red-300 focus:border-red-400"
                    : " border-gray-200 focus:border-blue-500")
                }
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className={
                    inputBase +
                    " pr-11" +
                    (error
                      ? " border-red-300 focus:border-red-400"
                      : " border-gray-200 focus:border-blue-500")
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600"
                >
                  <AlertIcon />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-2xl transition-colors cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Forgot your password?{" "}
            <span className="text-gray-600 font-medium">Contact your administrator.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}