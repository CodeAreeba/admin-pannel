import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import pagePermissions from "../config/pagePermissions";

const ProtectedRoute = ({ path, children }) => {
  const { loading, isAuthenticated, can } = useAuth();

  if (loading) return null; // or spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const permission = pagePermissions[path];
  if (permission && !can(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
