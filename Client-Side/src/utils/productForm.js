export const BLANK_PRODUCT_FORM = {
  sku: "",
  name: "",
  category: "Electronics",
  price: "",
  quantity: "",
  minStock: "",
};

export const createProductFormState = (product) => ({
  sku: product?.sku ?? "",
  name: product?.name ?? "",
  category: product?.category ?? "Electronics",
  price: product ? String(product.price) : "",
  quantity: product ? String(product.quantity) : "",
  minStock: product ? String(product.minStock) : "",
});

export const normalizeProductPayload = (form) => ({
  sku: form.sku.trim().toUpperCase(),
  name: form.name.trim(),
  category: form.category,
  price: parseFloat(form.price),
  quantity: parseInt(form.quantity, 10),
  minStock: parseInt(form.minStock, 10),
});

export const validateProductForm = ({ form, products, editItem }) => {
  if (!form.sku.trim() || !form.name.trim() || !form.price || !form.quantity || !form.minStock) {
    return "All fields are required.";
  }

  if ([form.price, form.quantity, form.minStock].some((value) => Number.isNaN(Number(value)))) {
    return "Price, Quantity, and Min Stock must be valid numbers.";
  }

  if (Number(form.price) < 0 || Number(form.quantity) < 0 || Number(form.minStock) < 0) {
    return "Price, quantity, and minimum stock cannot be negative.";
  }

  if (!Number.isInteger(Number(form.quantity)) || !Number.isInteger(Number(form.minStock))) {
    return "Quantity and Min Stock must be whole numbers.";
  }

  const duplicateSku = products.find(
    (product) => product.sku.toUpperCase() === form.sku.trim().toUpperCase() && product.id !== editItem?.id
  );

  if (duplicateSku) {
    return "SKU already exists. Each product must have a unique SKU.";
  }

  return "";
};
