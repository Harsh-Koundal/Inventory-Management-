import {
  Archive,
  History,
  LayoutDashboard,
  Layers,
  Package,
  ShoppingCart,
} from "lucide-react";

export const APP_NAME = "InvenTrack";
export const APP_VERSION = "v2.4.1";

export const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123",
  user: { name: "System Admin", email: "admin@example.com", role: "ADMIN" },
};

export const PAGE_TITLES = {
  dashboard: "Dashboard",
  products: "Product Management",
  stock: "Stock Management",
  orders: "Order Management",
  history: "Stock History",
};

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "products", label: "Products", Icon: Package },
  { id: "stock", label: "Stock", Icon: Layers },
  { id: "orders", label: "Orders", Icon: ShoppingCart },
  { id: "history", label: "Stock History", Icon: History },
];

export const DASHBOARD_STAT_CONFIG = [
  { key: "products", icon: Package, label: "Total Products", color: "indigo" },
  { key: "stock", icon: Archive, label: "Total Stock", color: "blue" },
  { key: "orders", icon: ShoppingCart, label: "Total Orders", color: "green" },
];
