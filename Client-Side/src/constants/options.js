export const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Furniture",
  "Office",
  "Storage",
];

export const ORDER_STATUSES = ["pending", "processing", "delivered", "cancelled"];

export const HISTORY_ACTION_OPTIONS = [
  { value: "All", label: "All Actions" },
  { value: "stock_added", label: "Stock Added" },
  { value: "stock_removed", label: "Stock Removed" },
  { value: "order_deduction", label: "Order Deducted" },
  { value: "cancellation_restore", label: "Cancelled / Restored" },
  { value: "product_added", label: "Product Added" },
];

export const BADGE_STYLES = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  in_stock: "bg-green-100 text-green-700",
  low_stock: "bg-amber-100 text-amber-700",
  out_stock: "bg-red-100 text-red-600",
  stock_added: "bg-emerald-100 text-emerald-700",
  stock_removed: "bg-red-100 text-red-600",
  order_deduction: "bg-blue-100 text-blue-700",
  cancellation_restore: "bg-purple-100 text-purple-700",
  product_added: "bg-teal-100 text-teal-700",
};

export const BADGE_LABELS = {
  pending: "Pending",
  processing: "Processing",
  delivered: "Delivered",
  cancelled: "Cancelled",
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_stock: "Out of Stock",
  stock_added: "Added",
  stock_removed: "Removed",
  order_deduction: "Order",
  cancellation_restore: "Restored",
  product_added: "New Product",
};
