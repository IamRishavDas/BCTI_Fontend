import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../common/Sidebar";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";
import { ConfirmProvider } from "../../contexts/confirmContext";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ConfirmProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col">
          <Navbar />   {/* Your existing Navbar (shows Admin Dashboard button) */}

          <main className="flex-1 p-6 md:p-10 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Outlet/>
            </motion.div>
          </main>
        </div>
      </div>
    </ConfirmProvider>
  );
}