import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount and when storage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // Listen for storage changes (in case logout happens in another tab)
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    // Completely remove everything from localStorage
    localStorage.clear();        // Clears all data (token + any future user data)
    setIsLoggedIn(false);
    navigate("/");
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
          <img 
            src="/bcti-logo.jpg" 
            alt="BCTI Logo" 
            className="h-12 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">BCTI</h1>
            <p className="text-xs text-gray-500 -mt-1">Computer Training Institute</p>
          </div>
        </div>

        {/* Auth Button */}
        <div>
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-2xl transition-all shadow-lg flex items-center gap-2"
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