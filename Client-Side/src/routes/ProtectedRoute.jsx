import { useInventory } from "../hooks/useInventory";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isDataLoading, user } = useInventory();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isDataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading workspace...
        </div>
      </div>
    );
  }

  return <Outlet />;
}
