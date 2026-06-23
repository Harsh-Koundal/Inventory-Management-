import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useInventory } from "../hooks/useInventory";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import StockHistory from "../pages/History/StockHistory";
import Orders from "../pages/Orders/Orders";
import Products from "../pages/Products/Products";
import StockList from "../pages/Stock/StockList";
import ProtectedRoute from "./ProtectedRoute";

function AuthLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function LoginRoute() {
  const { user } = useInventory();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock" element={<StockList />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/history" element={<StockHistory />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
