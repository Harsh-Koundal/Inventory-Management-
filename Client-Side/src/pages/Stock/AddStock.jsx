import { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import StockAdjustmentModal from "../../modals/StockAdjustmentModal";

export default function AddStock({ adjustment, onClose }) {
  const { adjustStock } = useInventory();
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  if (!adjustment) {
    return null;
  }

  const handleClose = () => {
    setQuantity("");
    setNote("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    const parsedQuantity = parseInt(quantity, 10);

    if (!quantity || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Enter a valid positive quantity.");
      return;
    }

    if (adjustment.mode === "reduce" && parsedQuantity > adjustment.product.quantity) {
      setError(`Cannot reduce below zero. Max removable: ${adjustment.product.quantity} units.`);
      return;
    }

    const result = await adjustStock({
      productId: adjustment.product.id,
      mode: adjustment.mode,
      quantity: parsedQuantity,
      note,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    handleClose();
  };

  return (
    <StockAdjustmentModal
      adjustment={adjustment}
      quantity={quantity}
      note={note}
      error={error}
      onQuantityChange={(value) => {
        setQuantity(value);
        setError("");
      }}
      onNoteChange={setNote}
      onClose={handleClose}
      onConfirm={handleConfirm}
    />
  );
}
