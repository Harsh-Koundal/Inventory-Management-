import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";
import { useInventory } from "../hooks/useInventory";

export default function DashboardLayout({ children }) {
  const { setSidebarOpen, sidebarOpen } = useInventory();

  return (
    <div className="flex min-h-screen bg-slate-50" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-transparent backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <Sidebar />
      <div className="hidden w-[220px] flex-shrink-0 lg:block" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
