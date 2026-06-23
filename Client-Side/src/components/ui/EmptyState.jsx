export default function EmptyState({ icon, message, sub }) {
  const Icon = icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-gray-100 rounded-2xl p-5 mb-4">
        <Icon size={30} className="text-gray-300" />
      </div>
      <p className="text-gray-600 font-semibold text-sm">{message}</p>
      {sub ? <p className="text-gray-400 text-xs mt-1">{sub}</p> : null}
    </div>
  );
}
