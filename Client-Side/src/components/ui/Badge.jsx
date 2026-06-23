import { BADGE_LABELS, BADGE_STYLES } from "../../constants/options";

export default function Badge({ type }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${BADGE_STYLES[type] || "bg-gray-100 text-gray-600"}`}
    >
      {BADGE_LABELS[type] || type}
    </span>
  );
}
