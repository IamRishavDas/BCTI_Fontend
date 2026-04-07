// src/components/Login.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import { showSuccess, showError } from "../utils/toast";

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({
          rollNo: rollNo.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("token", result.data);

        const user = getUser();

        showSuccess(`Login successful as ${user.role}`);

        // Correct Redirect
        if (user.role.toLowerCase() === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      } else {
        setError(result.message || result.Message || "Invalid Roll Number or Password");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-medium transition-colors"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <img 
              src="/bcti-logo.jpg" 
              alt="BCTI Logo" 
              className="h-20 w-auto mx-auto object-contain mb-4"
            />
            <h2 className="text-3xl font-semibold text-gray-900">Student / Admin Login</h2>
            <p className="text-gray-500 mt-2">BCTI Computer Training Institute</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Roll Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter your Roll No"
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-2xl">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-lg rounded-2xl transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Forgot password? Contact administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
}