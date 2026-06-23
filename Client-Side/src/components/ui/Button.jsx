export default function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200",
    secondary:
      "border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200",
    ghost: "text-gray-500 hover:bg-gray-100 bg-transparent",
  };

  return (
    <button
      type={type}
      className={`transition-colors rounded-xl ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
