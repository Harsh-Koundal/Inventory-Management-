import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useInventory } from "../../hooks/useInventory";

const toastStyles = {
  error: {
    wrapper: "border-red-200 bg-white text-red-700",
    icon: "text-red-500",
    Icon: AlertCircle,
  },
  success: {
    wrapper: "border-emerald-200 bg-white text-emerald-700",
    icon: "text-emerald-500",
    Icon: CheckCircle2,
  },
  info: {
    wrapper: "border-sky-200 bg-white text-sky-700",
    icon: "text-sky-500",
    Icon: Info,
  },
};

export default function ToastViewport() {
  const { dismissToast, toasts } = useInventory();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => {
        const config = toastStyles[toast.tone] || toastStyles.info;
        const Icon = config.Icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${config.wrapper}`}
          >
            <Icon size={18} className={`mt-0.5 flex-shrink-0 ${config.icon}`} />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
