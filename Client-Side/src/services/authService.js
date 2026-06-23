import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5020/api";

const STORAGE_KEYS = {
  token: "inventory.auth.token",
  user: "inventory.auth.user",
};

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
};

const readStoredJson = (key) => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
};

export const getToken = () => {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.token);
};

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  const segments = token.split(".");

  if (segments.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(segments[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const persistSession = ({ token, user }) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.token, token);
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const clearSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.token);
  window.localStorage.removeItem(STORAGE_KEYS.user);
};

export const getStoredSession = () => {
  const token = getToken();
  const user = readStoredJson(STORAGE_KEYS.user);

  if (!token || !user || isTokenExpired(token)) {
    clearSession();
    return { token: null, user: null };
  }

  return { token, user };
};

export const loginWithCredentials = async (email, password) => {
  try {
    const response = await authClient.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    const { token, user } = response.data || {};

    if (!token || !user) {
      return { ok: false, message: "Login response is missing session data." };
    }

    persistSession({ token, user });

    return { ok: true, token, user };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message || "Unable to login.",
    };
  }
};

export const logoutRequest = async () => {
  try {
    const response = await authClient.post("/auth/logout");
    return { ok: true, message: response.data?.message || "Logged out successfully." };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || error.message || "Unable to logout.",
    };
  }
};
