import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  var navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            B
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              BCTI
            </h1>
          </div>
        </div>

        {/* Only Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-all shadow-lg"
        >
          Login
        </motion.button>
      </div>
    </motion.nav>
  );
}