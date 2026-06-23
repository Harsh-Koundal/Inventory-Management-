export default function InputField({ label, className = "", ...props }) {
  return (
    <div>
      {label ? (
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      ) : null}
      <input
        className={`w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-gray-50 hover:bg-white ${className}`}
        {...props}
      />
    </div>
  );
}
