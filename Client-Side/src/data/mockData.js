const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

export const INIT_PRODUCTS = [
  { id: "P001", sku: "SKU-LAP-001", name: 'Pro Laptop 15"', category: "Electronics", price: 999.99, quantity: 15, minStock: 5 },
  { id: "P002", sku: "SKU-MSE-002", name: "Wireless Mouse", category: "Electronics", price: 29.99, quantity: 3, minStock: 10 },
  { id: "P003", sku: "SKU-KBD-003", name: "Mech Keyboard", category: "Electronics", price: 79.99, quantity: 45, minStock: 10 },
  { id: "P004", sku: "SKU-MON-004", name: '4K Monitor 27"', category: "Electronics", price: 349.99, quantity: 8, minStock: 5 },
  { id: "P005", sku: "SKU-HPH-005", name: "Headphones ANC", category: "Electronics", price: 149.99, quantity: 2, minStock: 5 },
  { id: "P006", sku: "SKU-HUB-006", name: "USB Hub 7-Port", category: "Accessories", price: 24.99, quantity: 30, minStock: 10 },
  { id: "P007", sku: "SKU-CHR-007", name: "Ergonomic Chair", category: "Furniture", price: 299.99, quantity: 6, minStock: 3 },
  { id: "P008", sku: "SKU-DSK-008", name: 'Standing Desk 60"', category: "Furniture", price: 599.99, quantity: 4, minStock: 2 },
  { id: "P009", sku: "SKU-WBC-009", name: "Webcam HD 1080p", category: "Electronics", price: 69.99, quantity: 1, minStock: 5 },
  { id: "P010", sku: "SKU-LMP-010", name: "LED Desk Lamp", category: "Accessories", price: 34.99, quantity: 22, minStock: 8 },
];

export const INIT_ORDERS = [
  { id: "ORD-001", items: [{ pid: "P001", name: 'Pro Laptop 15"', qty: 2, price: 999.99 }, { pid: "P003", name: "Mech Keyboard", qty: 2, price: 79.99 }], status: "delivered", total: 2159.96, createdAt: ago(4320), notes: "Express delivery" },
  { id: "ORD-002", items: [{ pid: "P004", name: '4K Monitor 27"', qty: 1, price: 349.99 }, { pid: "P005", name: "Headphones ANC", qty: 2, price: 149.99 }], status: "processing", total: 649.97, createdAt: ago(1440), notes: "" },
  { id: "ORD-003", items: [{ pid: "P006", name: "USB Hub 7-Port", qty: 5, price: 24.99 }], status: "cancelled", total: 124.95, createdAt: ago(720), notes: "Customer cancelled" },
  { id: "ORD-004", items: [{ pid: "P007", name: "Ergonomic Chair", qty: 3, price: 299.99 }], status: "pending", total: 899.97, createdAt: ago(120), notes: "Bulk order" },
];

export const INIT_HISTORY = [
  { id: "H001", pid: "P001", name: 'Pro Laptop 15"', action: "order_deduction", qty: -2, note: "Order ORD-001", ts: ago(4320) },
  { id: "H002", pid: "P003", name: "Mech Keyboard", action: "order_deduction", qty: -2, note: "Order ORD-001", ts: ago(4319) },
  { id: "H003", pid: "P004", name: '4K Monitor 27"', action: "order_deduction", qty: -1, note: "Order ORD-002", ts: ago(1440) },
  { id: "H004", pid: "P005", name: "Headphones ANC", action: "order_deduction", qty: -2, note: "Order ORD-002", ts: ago(1439) },
  { id: "H005", pid: "P006", name: "USB Hub 7-Port", action: "order_deduction", qty: -5, note: "Order ORD-003", ts: ago(740) },
  { id: "H006", pid: "P006", name: "USB Hub 7-Port", action: "cancellation_restore", qty: 5, note: "ORD-003 cancelled", ts: ago(720) },
  { id: "H007", pid: "P007", name: "Ergonomic Chair", action: "order_deduction", qty: -3, note: "Order ORD-004", ts: ago(120) },
  { id: "H008", pid: "P002", name: "Wireless Mouse", action: "stock_added", qty: 10, note: "Restock shipment", ts: ago(2880) },
  { id: "H009", pid: "P009", name: "Webcam HD 1080p", action: "stock_removed", qty: -4, note: "Damaged goods", ts: ago(60) },
];
