import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const styles = {
  error: {
    wrapper: "border-red-200 bg-red-50 text-red-700",
    icon: "text-red-500",
    Icon: AlertCircle,
  },
  success: {
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "text-emerald-500",
    Icon: CheckCircle2,
  },
  info: {
    wrapper: "border-sky-200 bg-sky-50 text-sky-700",
    icon: "text-sky-500",
    Icon: Info,
  },
};

export default function Notice({ message, tone = "info" }) {
  if (!message) {
    return null;
  }

  const config = styles[tone] || styles.info;
  const Icon = config.Icon;

  return (
    <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${config.wrapper}`}>
      <Icon size={16} className={`mt-0.5 flex-shrink-0 ${config.icon}`} />
      <p>{message}</p>
    </div>
  );
}
