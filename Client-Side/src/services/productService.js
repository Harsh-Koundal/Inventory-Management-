import { api } from "./api";

export const productService = {
  createProduct: (payload) => api.post("/products", payload),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  getProducts: () => api.get("/products"),
  updateProduct: (productId, payload) => api.put(`/products/${productId}`, payload),
};
