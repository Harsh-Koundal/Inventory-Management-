import { useInventory } from "../hooks/useInventory";
import Login from "../pages/Auth/Login";

export default function ProtectedRoute({ children }) {
  const { user } = useInventory();

  if (!user) {
    return <Login />;
  }

  return children;
}
