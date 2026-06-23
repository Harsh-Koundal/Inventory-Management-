export const BLANK_ORDER_ROW = { pid: "", qty: 1 };

export const getOrderLineTotal = (products, row) => {
  const product = products.find((item) => item.id === row.pid);
  return product ? product.price * row.qty : 0;
};

export const getOrderTotal = (products, rows) =>
  rows.reduce((sum, row) => sum + getOrderLineTotal(products, row), 0);

export const validateOrderForm = ({ orderItems, products }) => {
  if (orderItems.every((row) => !row.pid)) {
    return "Add at least one product.";
  }

  const filledRows = orderItems.filter((row) => row.pid);
  const productIds = filledRows.map((row) => row.pid);

  if (new Set(productIds).size !== productIds.length) {
    return "Duplicate products are not allowed. Use a single row with a higher quantity instead.";
  }

  for (const row of filledRows) {
    const product = products.find((item) => item.id === row.pid);

    if (!Number.isInteger(row.qty) || row.qty <= 0) {
      return "Each order line must have a positive quantity.";
    }

    if (!product || product.quantity < row.qty) {
      return `Insufficient stock for "${product?.name}". Available: ${product?.quantity ?? 0} units.`;
    }
  }

  return "";
};
