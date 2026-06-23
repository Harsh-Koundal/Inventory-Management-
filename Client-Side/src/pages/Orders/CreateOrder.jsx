import { useMemo, useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import CreateOrderModal from "../../modals/CreateOrderModal";
import {
  BLANK_ORDER_ROW,
  getOrderTotal,
  validateOrderForm,
} from "../../utils/orderForm";

export default function CreateOrder({ open, onClose, onCreated }) {
  const { createOrder, products } = useInventory();
  const [orderItems, setOrderItems] = useState([{ ...BLANK_ORDER_ROW }]);
  const [orderNote, setOrderNote] = useState("");
  const [formError, setFormError] = useState("");

  const orderTotal = useMemo(() => getOrderTotal(products, orderItems), [orderItems, products]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    setOrderItems([{ ...BLANK_ORDER_ROW }]);
    setOrderNote("");
    setFormError("");
    onClose();
  };

  const handleProductChange = (index, productId) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setOrderItems((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { pid: product.id, qty: 1 } : row))
    );
    setFormError("");
  };

  const handleQuantityChange = (index, value) => {
    const product = products.find((item) => item.id === orderItems[index].pid);
    const max = product ? product.quantity : 9999;
    const nextQuantity = Math.max(1, Math.min(parseInt(value, 10) || 1, max));

    setOrderItems((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { ...row, qty: nextQuantity } : row))
    );
  };

  const handleSubmit = () => {
    const errorMessage = validateOrderForm({ orderItems, products });

    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }

    const result = createOrder({ items: orderItems.filter((row) => row.pid), note: orderNote });

    if (!result.ok) {
      setFormError(result.message);
      return;
    }

    onCreated?.(result.message);
    handleClose();
  };

  return (
    <CreateOrderModal
      formError={formError}
      items={orderItems}
      note={orderNote}
      orderTotal={orderTotal}
      products={products}
      onAddRow={() => setOrderItems((prev) => [...prev, { ...BLANK_ORDER_ROW }])}
      onClose={handleClose}
      onNoteChange={setOrderNote}
      onProductChange={handleProductChange}
      onQuantityChange={handleQuantityChange}
      onRemoveRow={(index) =>
        setOrderItems((prev) => prev.filter((_, rowIndex) => rowIndex !== index))
      }
      onSubmit={handleSubmit}
    />
  );
}
