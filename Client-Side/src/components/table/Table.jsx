export function Table({ children, className = "" }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }) {
  return <thead>{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-gray-50">{children}</tbody>;
}

export function TableRow({ children, className = "" }) {
  return <tr className={className}>{children}</tr>;
}

export function TableHeaderCell({ children, align = "left" }) {
  const alignClass =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

  return (
    <th
      className={`px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-widest ${alignClass}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-5 py-3.5 ${className}`}>{children}</td>;
}
