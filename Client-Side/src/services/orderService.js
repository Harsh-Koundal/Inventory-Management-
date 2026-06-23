import { api } from "./api";

export const orderService = {
  cancelOrder: (orderId) => api.patch(`/orders/${orderId}/cancel`),
  createOrder: (payload) => api.post("/orders", payload),
  getOrders: () => api.get("/orders"),
};
