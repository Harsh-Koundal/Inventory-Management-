export default function StatCard({ icon, label, value, sub, color }) {
  const Icon = icon;

  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl flex-shrink-0 ${colorMap[color] || colorMap.indigo}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{value}</p>
        {sub ? <p className="text-xs text-gray-400 mt-1">{sub}</p> : null}
      </div>
    </div>
  );
}
