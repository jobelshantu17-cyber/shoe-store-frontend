import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // If no user OR user is not admin → redirect to admin/login
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
