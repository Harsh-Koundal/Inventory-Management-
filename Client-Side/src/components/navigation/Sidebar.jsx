import { createElement } from "react";
import { Box, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { APP_NAME, APP_VERSION, NAV_ITEMS } from "../../constants/appConstants";
import { useInventory } from "../../hooks/useInventory";

export default function Sidebar() {
  const {
    initials,
    lowStockCount,
    logout,
    pendingCount,
    showToast,
    setSidebarOpen,
    sidebarOpen,
    user,
  } = useInventory();

  const handleNavigate = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    showToast(result.message, result.ok ? "success" : "error");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-[220px] flex-col overflow-hidden border-r border-gray-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-4">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
          <Box size={15} className="text-gray-700" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{APP_NAME}</p>
          <p className="text-xs text-gray-400">{APP_VERSION} - {user.role}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map(({ id, path, label, Icon: NavIcon }) => (
          <NavLink
            key={id}
            to={path}
            onClick={handleNavigate}
            className={({ isActive }) =>
              `flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {createElement(NavIcon, { size: 16, className: "flex-shrink-0" })}
            <span className="flex-1 text-left">{label}</span>
            {id === "stock" && lowStockCount > 0 ? (
              <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                {lowStockCount}
              </span>
            ) : null}
            {id === "orders" && pendingCount > 0 ? (
              <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                {pendingCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 px-2 pb-3 pt-2">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-medium text-gray-600">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="rounded p-1 text-gray-400 transition-colors hover:text-gray-700"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
