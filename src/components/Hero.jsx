import { motion } from "framer-motion";
import Notice from "./Notice";

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
        
        {/* Left Content - Main Heading */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7 space-y-8"
        >
          <h1 className="text-6xl md:text-7xl font-bold leading-none text-gray-900 tracking-tight">
            Bhadreswar Computer &<br />
            <span className="text-blue-700">Technical Institute</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg">
            BCTI Computer Training Institute offers focused courses 
            with expert faculty support since 2008.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-2xl shadow-md transition-all"
            >
              Browse Courses
            </motion.button> */}
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.open('tel:+918420029222', '_self')}
              className="px-10 py-4 border-2 border-gray-800 hover:bg-gray-100 text-gray-800 font-semibold rounded-2xl transition-all"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
        <Notice/>
      </div>
    </section>
  );
}