import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FullScreenLoader } from "../components/ui/FullScreenLoader";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);

  if (isInitializing) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitializing = useAuthStore((s) => s.isInitializing);

  if (isInitializing) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
