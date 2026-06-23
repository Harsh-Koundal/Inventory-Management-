import { api } from "./api";

export const stockService = {
  adjustStock: (payload) => api.post("/stock/adjust", payload),
  getHistory: () => api.get("/stock/history"),
};
