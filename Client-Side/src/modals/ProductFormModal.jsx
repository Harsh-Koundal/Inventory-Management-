import { AlertTriangle, Save } from "lucide-react";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";
import { CATEGORIES } from "../constants/options";
import Modal from "./Modal";

export default function ProductFormModal({
  form,
  formError,
  isEditing,
  itemName,
  onChange,
  onClose,
  onSave,
}) {
  return (
    <Modal title={isEditing ? `Edit - ${itemName}` : "Add New Product"} onClose={onClose}>
      <div className="space-y-4">
        {formError ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" /> {formError}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="SKU *"
            value={form.sku}
            onChange={(event) => onChange("sku", event.target.value)}
            placeholder="SKU-XXX-000"
          />
          <SelectField
            label="Category *"
            value={form.category}
            onChange={(event) => onChange("category", event.target.value)}
          >
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </SelectField>
        </div>
        <InputField
          label="Product Name *"
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder='e.g. Pro Laptop 15"'
        />
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Price ($) *"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="0.00"
          />
          <InputField
            label="Qty *"
            type="number"
            min="0"
            value={form.quantity}
            onChange={(event) => onChange("quantity", event.target.value)}
            placeholder="0"
          />
          <InputField
            label="Min Stock *"
            type="number"
            min="0"
            value={form.minStock}
            onChange={(event) => onChange("minStock", event.target.value)}
            placeholder="5"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-2xl py-2.5 text-sm font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-bold shadow-lg shadow-indigo-200"
          >
            <Save size={15} /> {isEditing ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
