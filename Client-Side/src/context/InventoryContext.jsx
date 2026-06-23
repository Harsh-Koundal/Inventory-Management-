import { useEffect, useState } from "react";
import { clearSession, getStoredSession, loginWithCredentials, logoutRequest } from "../services/authService";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { stockService } from "../services/stockService";
import { generateId, getInitials } from "../utils/format";
import { InventoryContext } from "./InventoryContextObject";

export function InventoryProvider({ children }) {
  const initialSession = getStoredSession();
  const [user, setUser] = useState(initialSession.user);
  const [token, setToken] = useState(initialSession.token);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(Boolean(initialSession.user));

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

  const resetInventoryState = () => {
    setProducts([]);
    setOrders([]);
    setHistory([]);
  };

  const handleUnauthorized = (message = "Your session has expired. Please sign in again.") => {
    clearSession();
    setUser(null);
    setToken(null);
    resetInventoryState();
    showToast(message, "error");
  };

  const loadInventoryData = async (showLoader = false) => {
    if (!user || !token) {
      resetInventoryState();
      setIsDataLoading(false);
      return { ok: false, message: "No active session." };
    }

    if (showLoader) {
      setIsDataLoading(true);
    }

    try {
      const [nextProducts, nextOrders, nextHistory] = await Promise.all([
        productService.getProducts(),
        orderService.getOrders(),
        stockService.getHistory(),
      ]);

      setProducts(nextProducts);
      setOrders(nextOrders);
      setHistory(nextHistory);

      return { ok: true };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to load inventory data." };
    } finally {
      if (showLoader) {
        setIsDataLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      loadInventoryData(true);
      return;
    }

    setIsDataLoading(false);
    resetInventoryState();
  }, [user, token]);

  const login = async (email, password) => {
    const result = await loginWithCredentials(email, password);

    if (!result.ok) {
      return result;
    }

    setUser(result.user);
    setToken(result.token);

    return { ok: true };
  };

  const logout = async () => {
    const result = await logoutRequest();

    clearSession();
    setUser(null);
    setToken(null);
    resetInventoryState();

    return result;
  };

  const createProduct = async (payload) => {
    try {
      const response = await productService.createProduct(payload);
      await loadInventoryData(false);
      return { ok: true, message: response.message };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to create product." };
    }
  };

  const updateProduct = async (productId, payload) => {
    try {
      const response = await productService.updateProduct(productId, payload);
      await loadInventoryData(false);
      return { ok: true, message: response.message };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to update product." };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await productService.deleteProduct(productId);
      await loadInventoryData(false);
      return { ok: true, message: response.message };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to delete product." };
    }
  };

  const adjustStock = async (payload) => {
    try {
      const response = await stockService.adjustStock(payload);
      await loadInventoryData(false);
      return { ok: true, message: response.message };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to adjust stock." };
    }
  };

  const createOrder = async (payload) => {
    try {
      const response = await orderService.createOrder(payload);
      await loadInventoryData(false);
      return { ok: true, message: response.message };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to create order." };
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      await loadInventoryData(false);
      return { ok: true, message: response.message };
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
      }

      return { ok: false, message: error.message || "Unable to cancel order." };
    }
  };

  const lowStockCount = products.filter((product) => product.quantity <= product.minStock).length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const initials = getInitials(user?.name);

  const value = {
    user,
    token,
    sidebarOpen,
    products,
    orders,
    history,
    toasts,
    isDataLoading,
    lowStockCount,
    pendingCount,
    initials,
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
    refreshInventory: loadInventoryData,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}
