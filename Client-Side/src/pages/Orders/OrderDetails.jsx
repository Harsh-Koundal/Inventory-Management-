import { XCircle, CheckCircle2, RefreshCw } from "lucide-react";
import ConfirmationDialog from "../../modals/ConfirmationDialog";

export default function OrderDetails({ orderId, status, open, onClose, onConfirm }) {
  if (!open || !orderId || !status) {
    return null;
  }

  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";

  const getIcon = () => {
    if (isCancelled) return XCircle;
    if (isDelivered) return CheckCircle2;
    return RefreshCw;
  };

  const getColors = () => {
    if (isCancelled) return { bg: "bg-red-100", text: "text-red-600", btn: "bg-red-600 hover:bg-red-700" };
    if (isDelivered) return { bg: "bg-emerald-100", text: "text-emerald-600", btn: "bg-emerald-600 hover:bg-emerald-700" };
    return { bg: "bg-indigo-100", text: "text-indigo-600", btn: "bg-indigo-600 hover:bg-indigo-700" };
  };

  const { bg, text, btn } = getColors();

  const getDesc = () => {
    if (isCancelled) return "Stock will be automatically restored for all items. This cannot be undone.";
    if (isDelivered) return "This will mark the order as delivered. This cannot be undone.";
    return `Change the status of order ${orderId} to ${status}?`;
  };

  return (
    <ConfirmationDialog
      title="Update Order Status"
      icon={getIcon()}
      iconWrapperClassName={bg}
      iconClassName={text}
      message={`Update order ${orderId} to ${status}?`}
      description={getDesc()}
      confirmLabel="Update Status"
      cancelLabel="Cancel"
      confirmClassName={btn}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
