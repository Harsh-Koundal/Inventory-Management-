import { api } from "./api";

export const productService = {
  createProduct: (payload) => {
    console.log(payload);
    return api.post("/products", payload);
  },

  deleteProduct: (productId) => api.delete(`/products/${productId}`),

  getProducts: () => api.get("/products"),

  updateProduct: (productId, payload) => {
    console.log(payload);
    return api.put(`/products/${productId}`, payload);
  },
};