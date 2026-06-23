import axios from "axios";
import { getToken } from "./authService";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5020/api";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const nextConfig = { ...config };
  const token = getToken();

  nextConfig.headers = nextConfig.headers ?? {};

  if (token && !nextConfig.headers.Authorization) {
    nextConfig.headers.Authorization = `Bearer ${token}`;
  }

  return nextConfig;
});

const normalizeError = (error) => {
  if (error.response) {
    const payload = error.response.data;
    const message =
      payload?.message ||
      (typeof payload === "string" ? payload : `Request failed with status ${error.response.status}`);

    throw new ApiError(message, error.response.status, payload);
  }

  throw new ApiError(error.message || "Network request failed.", 0, null);
};

export async function request(path, options = {}) {
  try {
    const response = await apiClient({
      url: path,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers,
      params: options.params,
    });

    return response.data;
  } catch (error) {
    normalizeError(error);
  }
}

export const api = {
  delete: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  patch: (path, body, options = {}) => request(path, { ...options, method: "PATCH", body }),
  post: (path, body, options = {}) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options = {}) => request(path, { ...options, method: "PUT", body }),
};
