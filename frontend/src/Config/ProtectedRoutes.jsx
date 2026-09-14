import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const ProtectedRoute = ({ allowedRole }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  // 1. Agar token hi nahi hai to seedha login par bhej do
  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. Agar admin route hai aur user ka role admin nahi hai
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Sahi hai to child page load karo
  return <Outlet />;
};

export default ProtectedRoute;