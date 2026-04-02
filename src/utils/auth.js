// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      rollNo: decoded.RollNo,
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Student",
      name: decoded.name || decoded.RollNo,   // fallback
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

export const isAuthenticated = () => !!getToken();

export const isAdmin = () => {
  const user = getUser();
  return user?.role?.toLowerCase() === "admin";
};

export const logout = (navigate) => {
  localStorage.clear();
  if (navigate) navigate("/");
};