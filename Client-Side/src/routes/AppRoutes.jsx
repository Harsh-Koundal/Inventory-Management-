import { useInventory } from "../hooks/useInventory";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import StockHistory from "../pages/History/StockHistory";
import Orders from "../pages/Orders/Orders";
import Products from "../pages/Products/Products";
import StockList from "../pages/Stock/StockList";

const pages = {
  dashboard: Dashboard,
  products: Products,
  stock: StockList,
  orders: Orders,
  history: StockHistory,
};

export default function AppRoutes() {
  const { activeTab } = useInventory();
  const ActivePage = pages[activeTab] || Dashboard;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ActivePage />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
