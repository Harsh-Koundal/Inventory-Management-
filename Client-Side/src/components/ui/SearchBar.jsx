import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
      />
    </div>
  );
}
