const DEFAULT_CATEGORY = "Electronics";
const DEFAULT_MIN_STOCK = 5;

export const normalizeProductMetadata = (description) => {
  if (!description) {
    return {
      category: DEFAULT_CATEGORY,
      minStock: DEFAULT_MIN_STOCK,
      description: "",
    };
  }

  try {
    const parsed = JSON.parse(description);

    return {
      category: parsed.category || DEFAULT_CATEGORY,
      minStock: Number.isInteger(parsed.minStock) ? parsed.minStock : DEFAULT_MIN_STOCK,
      description: parsed.description || "",
    };
  } catch {
    return {
      category: DEFAULT_CATEGORY,
      minStock: DEFAULT_MIN_STOCK,
      description,
    };
  }
};

export const serializeProductMetadata = ({ category, minStock, description = "" }) =>
  JSON.stringify({
    category,
    minStock,
    description,
  });

export const mapProduct = (product) => {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    minStock: product.minStock,
    description: product.description || "",
    price: Number(product.price),
    quantity: product.stock?.quantity ?? 0,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

const statusMap = {
  PENDING: "pending",
  COMPLETED: "delivered",
  CANCELLED: "cancelled",
};

export const mapOrder = (order) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: statusMap[order.status] || "pending",
  total: Number(order.totalAmount),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  notes: order.notes || "",
  items: order.items.map((item) => ({
    pid: item.productId,
    name: item.product.name,
    qty: item.quantity,
    price: Number(item.unitPrice),
  })),
});

export const mapHistory = (entry) => {
  const typeToAction = {
    STOCK_IN: "stock_added",
    STOCK_OUT: "stock_removed",
    ORDER_PLACED: "order_deduction",
    ORDER_CANCELLED: "cancellation_restore",
  };

  const derivedAction =
    typeToAction[entry.type] ||
    (entry.quantity >= 0 ? "stock_added" : "stock_removed");

  return {
    id: entry.id,
    pid: entry.productId,
    name: entry.product.name,
    action: derivedAction,
    qty: entry.quantity,
    note: entry.notes || (entry.referenceId ? `Reference ${entry.referenceId}` : "Inventory update"),
    ts: entry.createdAt,
    previousQty: entry.previousQty,
    newQty: entry.newQty,
  };
};
