import { useState } from "react";
import { INIT_HISTORY, INIT_ORDERS, INIT_PRODUCTS } from "../data/mockData";
import { generateId, getInitials } from "../utils/format";
import { InventoryContext } from "./InventoryContextObject";
import {
  clearSession,
  getStoredSession,
  loginWithCredentials,
  logoutRequest,
} from "../services/authService";

export function InventoryProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession().user);
  const [token, setToken] = useState(() => getStoredSession().token);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [history, setHistory] = useState(INIT_HISTORY);
  const [toasts, setToasts] = useState([]);

  const dismissToast = (toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  const showToast = (message, tone = "info") => {
    const id = generateId("T");

    setToasts((prev) => [...prev, { id, message, tone }]);

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 3200);
    }

    return id;
  };

  const addHistory = (entry) => {
    setHistory((prev) => [
      { id: generateId("H"), ts: new Date().toISOString(), ...entry },
      ...prev,
    ]);
  };

  const validateProductPayload = (payload, currentId = null) => {
    if (!payload.sku?.trim() || !payload.name?.trim()) {
      return "Product name and SKU are required.";
    }

    if (payload.price < 0 || payload.quantity < 0 || payload.minStock < 0) {
      return "Price, quantity, and minimum stock must be non-negative.";
    }

    if (!Number.isInteger(payload.quantity) || !Number.isInteger(payload.minStock)) {
      return "Quantity and minimum stock must be whole numbers.";
    }

    const duplicateSku = products.find(
      (product) =>
        product.sku.toUpperCase() === payload.sku.trim().toUpperCase() && product.id !== currentId
    );

    if (duplicateSku) {
      return "SKU already exists. Each product must have a unique SKU.";
    }

    return "";
  };

  const login = async (email, password) => {
    const result = await loginWithCredentials(email, password);

    if (!result.ok) {
      return result;
    }

    setUser(result.user);
    setToken(result.token);
    setActiveTab("dashboard");

    return { ok: true };
  };

  const logout = async () => {
    const result = await logoutRequest();

    clearSession();
    setUser(null);
    setToken(null);
    setActiveTab("dashboard");

    return result;
  };

  const createProduct = (payload) => {
    const validationError = validateProductPayload(payload);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const newProduct = {
      id: generateId("P"),
      ...payload,
      sku: payload.sku.trim().toUpperCase(),
      name: payload.name.trim(),
    };

    setProducts((prev) => [...prev, newProduct]);
    addHistory({
      pid: newProduct.id,
      name: newProduct.name,
      action: "product_added",
      qty: newProduct.quantity,
      note: "Initial stock added",
    });

    return { ok: true, message: `${newProduct.name} added successfully.` };
  };

  const updateProduct = (productId, payload) => {
    const currentProduct = products.find((product) => product.id === productId);

    if (!currentProduct) {
      return { ok: false, message: "Product not found." };
    }

    const validationError = validateProductPayload(payload, productId);

    if (validationError) {
      return { ok: false, message: validationError };
    }

    const nextQuantity = Number(payload.quantity);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 0) {
      return { ok: false, message: "Quantity must be a non-negative whole number." };
    }

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...payload,
              sku: payload.sku.trim().toUpperCase(),
              name: payload.name.trim(),
            }
          : product
      )
    );

    const quantityDelta = nextQuantity - currentProduct.quantity;

    if (quantityDelta !== 0) {
      addHistory({
        pid: currentProduct.id,
        name: payload.name.trim(),
        action: quantityDelta > 0 ? "stock_added" : "stock_removed",
        qty: quantityDelta,
        note: "Adjusted while editing product details",
      });
    }

    return { ok: true, message: `${payload.name.trim()} updated successfully.` };
  };

  const deleteProduct = (productId) => {
    const currentProduct = products.find((product) => product.id === productId);

    if (!currentProduct) {
      return { ok: false, message: "Product not found." };
    }

    const hasActiveOrders = orders.some(
      (order) =>
        ["pending", "processing"].includes(order.status) &&
        order.items.some((item) => item.pid === productId)
    );

    if (hasActiveOrders) {
      return {
        ok: false,
        message: "This product appears in active orders and cannot be deleted.",
      };
    }

    setProducts((prev) => prev.filter((product) => product.id !== productId));
    return { ok: true, message: `${currentProduct.name} deleted successfully.` };
  };

  const adjustStock = ({ productId, mode, quantity, note }) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return { ok: false, message: "Product not found." };
    }

    if (!["add", "reduce"].includes(mode)) {
      return { ok: false, message: "Invalid stock adjustment mode." };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { ok: false, message: "Quantity must be a positive whole number." };
    }

    const delta = mode === "add" ? quantity : -quantity;

    if (product.quantity + delta < 0) {
      return { ok: false, message: "Stock cannot go below zero." };
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + delta } : item
      )
    );

    addHistory({
      pid: product.id,
      name: product.name,
      action: mode === "add" ? "stock_added" : "stock_removed",
      qty: delta,
      note: note.trim() || (mode === "add" ? "Manual restock" : "Manual stock reduction"),
    });

    return {
      ok: true,
      message: `${product.name} stock ${mode === "add" ? "increased" : "reduced"} successfully.`,
    };
  };

  const createOrder = ({ items, note }) => {
    if (!items.length) {
      return { ok: false, message: "Add at least one product to the order." };
    }

    let lineItems;

    try {
      const seen = new Set();
      lineItems = items.map((row) => {
        const product = products.find((item) => item.id === row.pid);

        if (!product) {
          throw new Error("One or more selected products no longer exist.");
        }

        if (seen.has(product.id)) {
          throw new Error("Duplicate products are not allowed in a single order.");
        }

        seen.add(product.id);

        if (!Number.isInteger(row.qty) || row.qty <= 0) {
          throw new Error(`Invalid quantity for "${product.name}".`);
        }

        if (product.quantity < row.qty) {
          throw new Error(`Insufficient stock for "${product.name}". Available: ${product.quantity}.`);
        }

        return {
          pid: product.id,
          name: product.name,
          qty: row.qty,
          price: product.price,
        };
      });
    } catch (error) {
      return { ok: false, message: error.message };
    }

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: lineItems,
      status: "pending",
      total: lineItems.reduce((sum, item) => sum + item.price * item.qty, 0),
      createdAt: new Date().toISOString(),
      notes: note.trim(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setProducts((prev) =>
      prev.map((product) => {
        const lineItem = lineItems.find((item) => item.pid === product.id);
        return lineItem
          ? { ...product, quantity: product.quantity - lineItem.qty }
          : product;
      })
    );

    lineItems.forEach((item) => {
      addHistory({
        pid: item.pid,
        name: item.name,
        action: "order_deduction",
        qty: -item.qty,
        note: `Order ${newOrder.id}`,
      });
    });

    return { ok: true, message: `Order ${newOrder.id} created successfully.` };
  };

  const cancelOrder = (orderId) => {
    const order = orders.find((item) => item.id === orderId);

    if (!order) {
      return { ok: false, message: "Order not found." };
    }

    if (!["pending", "processing"].includes(order.status)) {
      return { ok: false, message: "Only pending or processing orders can be cancelled." };
    }

    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...item, status: "cancelled" } : item
      )
    );

    setProducts((prev) =>
      prev.map((product) => {
        const lineItem = order.items.find((item) => item.pid === product.id);
        return lineItem
          ? { ...product, quantity: product.quantity + lineItem.qty }
          : product;
      })
    );

    order.items.forEach((item) => {
      addHistory({
        pid: item.pid,
        name: item.name,
        action: "cancellation_restore",
        qty: item.qty,
        note: `Order ${orderId} cancelled`,
      });
    });

    return { ok: true, message: `Order ${orderId} cancelled and stock restored.` };
  };

  const lowStockCount = products.filter((product) => product.quantity <= product.minStock).length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const initials = getInitials(user?.name);

  const value = {
    user,
    token,
    activeTab,
    sidebarOpen,
    products,
    orders,
    history,
    toasts,
    lowStockCount,
    pendingCount,
    initials,
    setActiveTab,
    setSidebarOpen,
    toggleSidebar: () => setSidebarOpen((prev) => !prev),
    login,
    logout,
    showToast,
    dismissToast,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    createOrder,
    cancelOrder,
    addHistory,
  };

  return (
    <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
  );
}
