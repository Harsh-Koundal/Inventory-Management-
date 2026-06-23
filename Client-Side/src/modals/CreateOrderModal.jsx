import { AlertTriangle, Plus, X } from "lucide-react";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { formatCurrency } from "../utils/format";
import Modal from "./Modal";

export default function CreateOrderModal({
  formError,
  items,
  note,
  orderTotal,
  products,
  onAddRow,
  onClose,
  onNoteChange,
  onProductChange,
  onQuantityChange,
  onRemoveRow,
  onSubmit,
}) {
  return (
    <Modal title="Create New Order" onClose={onClose} wide>
      <div className="space-y-4">
        {formError ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" /> {formError}
          </div>
        ) : null}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Items</label>
            <button
              onClick={onAddRow}
              className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-800"
            >
              <Plus size={12} /> Add row
            </button>
          </div>
          <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
            {items.map((row, index) => {
              const product = products.find((item) => item.id === row.pid);

              return (
                <div key={`${row.pid}-${index}`} className="flex items-center gap-2 rounded-xl bg-gray-50 p-2">
                  <select
                    value={row.pid}
                    onChange={(event) => onProductChange(index, event.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select product...</option>
                    {products
                      .filter((item) => item.quantity > 0)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {formatCurrency(item.price)} (Stock: {item.quantity})
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={row.qty}
                    onChange={(event) => onQuantityChange(index, event.target.value)}
                    className="w-20 rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="w-24 text-right">
                    <span className="text-sm font-bold tabular-nums text-gray-900">
                      {product ? formatCurrency(product.price * row.qty) : "-"}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveRow(index)}
                    disabled={items.length === 1}
                    className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-100 disabled:opacity-30"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {items.some((row) => row.pid) ? (
          <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-3.5">
            <span className="text-sm font-semibold text-indigo-700">Order Total</span>
            <span className="text-xl font-black tabular-nums text-indigo-900">
              {formatCurrency(orderTotal)}
            </span>
          </div>
        ) : null}

        <InputField
          label="Notes / Instructions (optional)"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Delivery instructions, purchase order number..."
        />

        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-2xl py-2.5 text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} className="flex-1 rounded-2xl py-2.5 text-sm font-bold shadow-lg shadow-indigo-200">
            Place Order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
