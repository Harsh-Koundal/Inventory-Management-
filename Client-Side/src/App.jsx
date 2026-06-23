import ToastViewport from "./components/ui/ToastViewport";
import { InventoryProvider } from "./context/InventoryContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <InventoryProvider>
      <AppRoutes />
      <ToastViewport />
    </InventoryProvider>
  );
}
