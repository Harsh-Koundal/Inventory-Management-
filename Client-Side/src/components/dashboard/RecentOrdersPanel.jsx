import { ShoppingBag, ShoppingCart } from "lucide-react";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import { formatCurrency, formatDate } from "../../utils/format";

export default function RecentOrdersPanel({ orders }) {
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Recent Orders</h3>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-400">
          {orders.length} total
        </span>
      </div>
      {recentOrders.length === 0 ? (
        <EmptyState icon={ShoppingCart} message="No orders yet" />
      ) : (
        <div className="divide-y divide-gray-50">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                <ShoppingBag size={16} className="text-indigo-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900">{order.id}</span>
                  <Badge type={order.status} />
                </div>
                <p className="text-xs text-gray-400">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} |{" "}
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <span className="text-sm font-bold tabular-nums text-gray-900">
                {formatCurrency(order.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
