import { Bell, Menu } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS, PAGE_TITLES } from "../../constants/appConstants";
import { useInventory } from "../../hooks/useInventory";

export default function Navbar() {
  const { initials, lowStockCount, pendingCount, toggleSidebar } = useInventory();
  const location = useLocation();

  const activeTab = useMemo(() => {
    const currentItem = NAV_ITEMS.find((item) => item.path === location.pathname);
    return currentItem?.id || "dashboard";
  }, [location.pathname]);

  return (
    <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm sm:px-5">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="rounded-xl p-2 transition-colors hover:bg-gray-100 lg:hidden">
          <Menu size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-base font-bold leading-tight text-gray-900">{PAGE_TITLES[activeTab]}</h1>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2 transition-colors hover:bg-gray-100">
          <Bell size={17} className="text-gray-500" />
          {lowStockCount > 0 || pendingCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          ) : null}
        </button>
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white transition-colors hover:bg-indigo-700">
          {initials}
        </div>
      </div>
    </header>
  );
}
