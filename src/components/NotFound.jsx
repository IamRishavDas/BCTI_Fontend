import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Big 404 */}
        <div className="text-[120px] font-bold text-blue-200 leading-none mb-6">
          404
        </div>

        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl transition-all shadow-lg"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-10 py-4 border-2 border-gray-700 hover:bg-gray-100 font-semibold rounded-2xl transition-all"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          BCTI Computer Training Institute
        </div>
      </motion.div>
    </div>
  );
}