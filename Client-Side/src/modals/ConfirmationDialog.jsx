import Modal from "./Modal";

export default function ConfirmationDialog({
  title,
  icon,
  iconClassName,
  iconWrapperClassName,
  message,
  description,
  confirmLabel,
  cancelLabel,
  confirmClassName,
  onClose,
  onConfirm,
}) {
  const Icon = icon;

  return (
    <Modal title={title} onClose={onClose}>
      <div className="text-center py-2">
        <div
          className={`rounded-2xl p-4 w-16 h-16 flex items-center justify-center mx-auto mb-5 ${iconWrapperClassName}`}
        >
          <Icon size={26} className={iconClassName} />
        </div>
        <p className="text-gray-900 font-bold mb-1">{message}</p>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-2.5 rounded-2xl text-sm font-bold transition-colors ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
