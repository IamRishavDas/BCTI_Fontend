import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useConfirm } from "../contexts/ConfirmContext";
import { showSuccess, showError } from "../utils/toast";
import { api } from "../services/api";
import { ChevronIconNav, KeyIconNav, LogoutIconNav, UserIconNav } from "../static/Svg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { promptInput, confirm } = useConfirm();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const publicPages = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/about", label: "About" },
    { path: "/notice", label: "Notice" },
  ];

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const isPublicRoute = publicPages.some(page => location.pathname === page.path);
      if (isPublicRoute && token) {
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

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    const isConfirmed = await confirm({
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      confirmText: "Yes, Logout",
      cancelText: "Cancel",
      type: "warning",
    });

    if (!isConfirmed) return;

    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
    showSuccess("Logged out successfully");
  };

  const handleChangePassword = async () => {
    setMenuOpen(false);
    try {
      const current = await promptInput({
        title: "Change Password",
        message: "Enter your current password",
        placeholder: "Current Password",
      });
      if (!current) return;

      const newPass = await promptInput({
        title: "Change Password",
        message: "Enter new password",
        placeholder: "New Password",
      });
      if (!newPass) return;

      const res = await api.changePassword(current, newPass);
      if (res.success) {
        showSuccess("Password changed successfully");
      } else {
        showError(res.message || res.Message || "Failed to change password");
      }
    } catch {
      showError("Something went wrong");
    }
  };

  const isPublicPage = publicPages.some(page => location.pathname === page.path);

  return (
    <motion.nav
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div
            style={{
              height: 38,
              width: 38,
              borderRadius: 10,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src="/bcti-logo.jpg"
              alt="BCTI"
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML =
                  '<span style="font-size:15px;font-weight:700;color:#2563eb">B</span>';
              }}
            />
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1, margin: 0 }}>
              BCTI
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, margin: 0 }}>
              Computer Training Institute
            </p>
          </div>
        </div>

        {/* Center Navigation - Only show on public pages */}
        {isPublicPage && (
          <div className="hidden md:flex items-center gap-1">
            {publicPages.map((page) => (
              <button
                key={page.path}
                onClick={() => navigate(page.path)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: location.pathname === page.path ? "#eff6ff" : "transparent",
                  color: location.pathname === page.path ? "#2563eb" : "#64748b",
                  fontWeight: location.pathname === page.path ? 600 : 500,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== page.path) {
                    e.currentTarget.style.background = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== page.path) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {page.label}
              </button>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isLoggedIn ? (
            <div ref={menuRef} style={{ position: "relative" }}>
              <motion.button
                onClick={() => setMenuOpen((v) => !v)}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  background: menuOpen ? "#f8fafc" : "#ffffff",
                  cursor: "pointer",
                  color: "#374151",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "background 0.15s",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#2563eb",
                  }}
                >
                  <UserIconNav />
                </span>
                <span className="hidden sm:inline">My Account</span>
                <motion.span
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: "#94a3b8", display: "flex" }}
                >
                  <ChevronIconNav />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 190,
                      background: "#ffffff",
                      border: "1px solid #f1f5f9",
                      borderRadius: 14,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    <button
                      onClick={handleChangePassword}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#374151",
                        textAlign: "left",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ color: "#64748b" }}>
                        <KeyIconNav />
                      </span>
                      Change Password
                    </button>

                    <div style={{ height: 1, background: "#f1f5f9", margin: "0 12px" }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#dc2626",
                        textAlign: "left",
                        transition: "background 0.12s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogoutIconNav />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              style={{
                padding: "9px 22px",
                background: "#2563eb",
                color: "#ffffff",
                fontWeight: 500,
                fontSize: 13,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(37,99,235,0.25)",
              }}
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}