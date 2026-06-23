export const formatCurrency = (value) =>
  `$${parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const generateId = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}`;

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
