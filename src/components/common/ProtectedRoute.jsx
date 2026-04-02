import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../utils/auth";

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}) {
  
  // Check if user is logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required, check role
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // If everything is fine, render the protected content
  return children;
}