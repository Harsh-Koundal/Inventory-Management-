import { XCircle } from "lucide-react";
import ConfirmationDialog from "../../modals/ConfirmationDialog";

export default function OrderDetails({ orderId, open, onClose, onConfirm }) {
  if (!open || !orderId) {
    return null;
  }

  return (
    <ConfirmationDialog
      title="Cancel Order"
      icon={XCircle}
      iconWrapperClassName="bg-amber-100"
      iconClassName="text-amber-600"
      message={`Cancel order ${orderId}?`}
      description="Stock will be automatically restored for all items. This cannot be undone."
      confirmLabel="Cancel Order"
      cancelLabel="Keep Order"
      confirmClassName="bg-amber-600 hover:bg-amber-700"
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
