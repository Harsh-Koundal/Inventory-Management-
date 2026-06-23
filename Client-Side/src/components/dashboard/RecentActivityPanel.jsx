import { ArrowDown, ArrowUp } from "lucide-react";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/format";

export default function RecentActivityPanel({ history }) {
  const recentHistory = [...history]
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 6);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">Recent Activity</h3>
        <span className="text-xs text-gray-400">{history.length} total events</span>
      </div>
      <div className="divide-y divide-gray-50">
        {recentHistory.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50"
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                item.qty > 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {item.qty > 0 ? (
                <ArrowUp size={14} className="text-green-600" />
              ) : (
                <ArrowDown size={14} className="text-red-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{item.name}</span> -{" "}
                <span className="text-gray-500">{item.note}</span>
              </p>
              <p className="mt-0.5 text-xs text-gray-400">{formatDate(item.ts)}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <Badge type={item.action} />
              <span
                className={`min-w-8 text-right text-sm font-black tabular-nums ${
                  item.qty > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {item.qty > 0 ? "+" : ""}
                {item.qty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
