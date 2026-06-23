import { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import ProductFormModal from "../../modals/ProductFormModal";
import {
  BLANK_PRODUCT_FORM,
  normalizeProductPayload,
  validateProductForm,
} from "../../utils/productForm";

export default function CreateProduct({ open, onClose, onCreated }) {
  const { createProduct, products } = useInventory();
  const [form, setForm] = useState(BLANK_PRODUCT_FORM);
  const [formError, setFormError] = useState("");

  if (!open) {
    return null;
  }

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError("");
  };

  const handleClose = () => {
    setForm(BLANK_PRODUCT_FORM);
    setFormError("");
    onClose();
  };

  const handleSave = async () => {
    const errorMessage = validateProductForm({ form, products, editItem: null });

    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }

    const result = await createProduct(normalizeProductPayload(form));

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    onCreated?.(result.message);
    handleClose();
  };

  return (
    <ProductFormModal
      form={form}
      formError={formError}
      isEditing={false}
      itemName=""
      onChange={handleChange}
      onClose={handleClose}
      onSave={handleSave}
    />
  );
}
