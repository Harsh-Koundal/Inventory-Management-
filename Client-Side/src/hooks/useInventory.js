import { useContext } from "react";
import { InventoryContext } from "../context/InventoryContextObject";

export const useInventory = () => {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }

  return context;
};
