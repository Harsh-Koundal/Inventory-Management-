import { AlertTriangle, Archive, Package, ShoppingCart } from "lucide-react";
import LowStockPanel from "../../components/dashboard/LowStockPanel";
import RecentActivityPanel from "../../components/dashboard/RecentActivityPanel";
import RecentOrdersPanel from "../../components/dashboard/RecentOrdersPanel";
import StatCard from "../../components/ui/StatCard";
import { useInventory } from "../../hooks/useInventory";

export default function Dashboard() {
  const { history, orders, products } = useInventory();

  const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);
  const lowStockItems = products.filter((product) => product.quantity <= product.minStock);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={products.length}
          sub="Active SKUs"
          color="indigo"
        />
        <StatCard
          icon={Archive}
          label="Total Stock"
          value={totalStock.toLocaleString()}
          sub="Units on hand"
          color="blue"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={orders.length}
          sub={`${orders.filter((order) => order.status === "pending").length} pending`}
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={lowStockItems.length}
          sub="Need restocking"
          color={lowStockItems.length > 0 ? "red" : "green"}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RecentOrdersPanel orders={orders} />
        <LowStockPanel items={lowStockItems} />
      </div>

      <RecentActivityPanel history={history} />
    </div>
  );
}
