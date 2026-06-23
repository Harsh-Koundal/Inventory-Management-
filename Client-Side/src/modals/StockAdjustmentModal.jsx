import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import Modal from "./Modal";

export default function StockAdjustmentModal({
  adjustment,
  quantity,
  note,
  error,
  onQuantityChange,
  onNoteChange,
  onClose,
  onConfirm,
}) {
  const isAdd = adjustment.mode === "add";
  const nextQuantity = quantity
    ? isAdd
      ? adjustment.product.quantity + parseInt(quantity, 10)
      : Math.max(0, adjustment.product.quantity - parseInt(quantity, 10))
    : null;

  return (
    <Modal title={`${isAdd ? "Add Stock" : "Remove Stock"} - ${adjustment.product.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-3.5 ${
            isAdd ? "border border-emerald-200 bg-emerald-50" : "border border-red-200 bg-red-50"
          }`}
        >
          <span className={`text-sm font-semibold ${isAdd ? "text-emerald-700" : "text-red-700"}`}>
            Current stock
          </span>
          <span className={`text-2xl font-black tabular-nums ${isAdd ? "text-emerald-700" : "text-red-700"}`}>
            {adjustment.product.quantity} <span className="text-sm font-medium">units</span>
          </span>
        </div>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <InputField
          label={`Units to ${isAdd ? "add" : "remove"} *`}
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
          placeholder="Enter quantity"
          autoFocus
        />
        <InputField
          label="Reason / Notes (optional)"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder={isAdd ? "e.g. Supplier restock" : "e.g. Damaged goods"}
        />
        {nextQuantity !== null ? (
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-500">New stock level</span>
            <span className="text-lg font-black tabular-nums text-gray-900">{nextQuantity} units</span>
          </div>
        ) : null}
        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-2xl py-2.5 text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant={isAdd ? "success" : "danger"}
            onClick={onConfirm}
            className="flex-1 rounded-2xl py-2.5 text-sm font-bold"
          >
            {isAdd ? "Add Stock" : "Remove Stock"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
