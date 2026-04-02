import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";  

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (rollNo && password) {
        alert("Login Successful! (Demo)");
        // Todo: Save token / redirect to dashboard later
        navigate("/");   // Go back to home after login
      } else {
        alert("Please enter Roll No and Password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}   // Goes back to previous page
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          ← Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center text-white text-4xl mb-4">
              B
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">Student Login</h2>
            <p className="text-gray-500 mt-2">BCTI Computer Training Institute</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Roll Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter your Roll No"
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-600 text-lg"
                required
              />
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg rounded-2xl transition-all disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Contact admin if you forgot your password
          </p>
        </div>
      </motion.div>
    </div>
  );
}