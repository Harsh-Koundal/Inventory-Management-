export const getStockStatus = (quantity, minStock) => {
  if (quantity === 0) {
    return "out_stock";
  }

  if (quantity <= minStock) {
    return "low_stock";
  }

  return "in_stock";
};
