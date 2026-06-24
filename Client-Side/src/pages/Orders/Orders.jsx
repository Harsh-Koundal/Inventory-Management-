import { Plus, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchBar from "../../components/ui/SearchBar";
import SelectField from "../../components/ui/SelectField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../components/table/Table";
import { ORDER_STATUSES } from "../../constants/options";
import { useInventory } from "../../hooks/useInventory";
import { formatCurrency, formatDate } from "../../utils/format";
import CreateOrder from "./CreateOrder";
import OrderDetails from "./OrderDetails";

export default function Orders() {
  const { updateOrderStatus, orders, showToast } = useInventory();
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [statusChange, setStatusChange] = useState(null); // { id, status }

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();

    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((order) => {
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        const matchesSearch =
          order.id.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query));

        return matchesStatus && matchesSearch;
      });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === "cancelled" || newStatus === "delivered") {
      setStatusChange({ id: orderId, status: newStatus });
    } else {
      const result = await updateOrderStatus(orderId, newStatus);
      showToast(result.message, result.ok ? "success" : "error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search orders..."
          className="flex-1"
        />
        <SelectField
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="bg-white"
        >
          <option value="All">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </SelectField>
        <Button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold"
        >
          <Plus size={16} /> New Order
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            message="No orders found"
            sub="Create your first order using the button above"
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow className="border-b border-gray-100 bg-gray-50">
                <TableHeaderCell>Order ID</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell align="right">Total</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="transition-colors hover:bg-gray-50">
                  <TableCell className="font-mono text-xs font-bold text-gray-600">
                    {order.id}
                  </TableCell>
                  <TableCell className="max-w-xs text-gray-500">
                    <div className="truncate text-xs">
                      {order.items.map((item) => `${item.name} x${item.qty}`).join(", ")}
                    </div>
                    <span className="text-xs text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums text-gray-900">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    {order.status === "delivered" || order.status === "cancelled" ? (
                      <Badge type={order.status} />
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent cursor-pointer transition-colors pr-8 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:0.75em_0.75em] ${
                          order.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        }}
                      >
                        <option value="pending" className="bg-white text-gray-900 font-sans">Pending</option>
                        <option value="processing" className="bg-white text-gray-900 font-sans">Processing</option>
                        <option value="delivered" className="bg-white text-gray-900 font-sans">Delivered</option>
                        <option value="cancelled" className="bg-white text-gray-900 font-sans">Cancelled</option>
                      </select>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "pending" || order.status === "processing" ? (
                      <button
                        onClick={() => setStatusChange({ id: order.id, status: "cancelled" })}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CreateOrder
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(message) => showToast(message, "success")}
      />
      <OrderDetails
        orderId={statusChange?.id}
        status={statusChange?.status}
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={async () => {
          const result = await updateOrderStatus(statusChange.id, statusChange.status);
          showToast(result.message, result.ok ? "success" : "error");
          setStatusChange(null);
        }}
      />
    </div>
  );
}
