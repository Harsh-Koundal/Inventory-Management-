import { useEffect, useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import ProductFormModal from "../../modals/ProductFormModal";
import {
  createProductFormState,
  normalizeProductPayload,
  validateProductForm,
} from "../../utils/productForm";

export default function EditProduct({ product, onClose, onUpdated }) {
  const { products, updateProduct } = useInventory();
  const [form, setForm] = useState(createProductFormState(product));
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setForm(createProductFormState(product));
    setFormError("");
  }, [product]);

  if (!product) {
    return null;
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError("");
  };

  const handleSave = async () => {
    const errorMessage = validateProductForm({ form, products, editItem: product });

    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }

    const result = await updateProduct(product.id, normalizeProductPayload(form));

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    onUpdated?.(result.message);
    onClose();
  };

  return (
    <ProductFormModal
      form={form}
      formError={formError}
      isEditing
      itemName={product.name}
      onChange={handleChange}
      onClose={onClose}
      onSave={handleSave}
    />
  );
}
