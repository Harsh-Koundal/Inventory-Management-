import { AlertTriangle, CheckCircle } from "lucide-react";

export default function LowStockPanel({ items }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
        <AlertTriangle size={15} className="text-amber-500" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Low Stock Alerts</h3>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center px-6">
          <div className="bg-green-100 rounded-full p-3 mb-3">
            <CheckCircle size={22} className="text-green-500" />
          </div>
          <p className="text-sm font-medium text-gray-600">All levels healthy</p>
          <p className="text-xs text-gray-400 mt-1">No restocking needed</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 max-h-56 overflow-y-auto">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between px-6 py-3 hover:bg-amber-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                <p className="text-xs text-gray-400">Min: {product.minStock}</p>
              </div>
              <div className="text-right ml-3">
                <span
                  className={`text-base font-black tabular-nums ${
                    product.quantity === 0 ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {product.quantity}
                </span>
                <p className="text-xs text-gray-400">units</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
