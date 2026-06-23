import { useInventory } from "../hooks/useInventory";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user } = useInventory();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
