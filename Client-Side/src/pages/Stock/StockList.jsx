import { AlertTriangle, ArrowDown, ArrowUp, Boxes } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import SearchBar from "../../components/ui/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../components/table/Table";
import { useInventory } from "../../hooks/useInventory";
import StockAdjustmentModal from "../../modals/StockAdjustmentModal";
import { getStockStatus } from "../../utils/inventory";

export default function StockList() {
  const { adjustStock, products, showToast } = useInventory();
  const [search, setSearch] = useState("");
  const [adjustment, setAdjustment] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const lowStockProducts = products.filter((product) => product.quantity <= product.minStock);

  const openAdjustment = (product, mode) => {
    setAdjustment({ product, mode });
    setQuantity("");
    setNote("");
    setError("");
  };

  const handleAdjust = () => {
    const parsedQuantity = parseInt(quantity, 10);

    if (!quantity || Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setError("Enter a valid positive quantity.");
      return;
    }

    if (adjustment.mode === "reduce" && parsedQuantity > adjustment.product.quantity) {
      setError(`Cannot reduce below zero. Max removable: ${adjustment.product.quantity} units.`);
      return;
    }

    const result = adjustStock({
      productId: adjustment.product.id,
      mode: adjustment.mode,
      quantity: parsedQuantity,
      note,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    showToast(result.message, "success");
    setAdjustment(null);
  };

  return (
    <div className="space-y-4">
      {lowStockProducts.length > 0 ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} below minimum stock
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              {lowStockProducts.map((product) => product.name).join(", ")}
            </p>
          </div>
        </div>
      ) : null}

      <SearchBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
      />

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Boxes}
            message="No products found"
            sub="Try a different search term"
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow className="border-b border-gray-100 bg-gray-50">
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell align="right">Stock</TableHeaderCell>
                <TableHeaderCell align="right">Min</TableHeaderCell>
                <TableHeaderCell align="center">Status</TableHeaderCell>
                <TableHeaderCell align="right">Adjust</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity, product.minStock);
                const barPercentage = Math.min(
                  100,
                  (product.quantity / Math.max(product.quantity, product.minStock * 3)) * 100
                );

                return (
                  <TableRow key={product.id} className="transition-colors hover:bg-gray-50">
                    <TableCell className="font-semibold text-gray-900">
                      {product.name}
                      <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all ${
                            status === "out_stock"
                              ? "bg-red-400"
                              : status === "low_stock"
                                ? "bg-amber-400"
                                : "bg-green-400"
                          }`}
                          style={{ width: `${barPercentage}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-gray-400">{product.sku}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`text-xl font-black tabular-nums ${
                          status === "out_stock"
                            ? "text-red-600"
                            : status === "low_stock"
                              ? "text-amber-600"
                              : "text-gray-900"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-gray-400">
                      {product.minStock}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge type={status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAdjustment(product, "add")}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                          <ArrowUp size={13} /> Add
                        </button>
                        <button
                          onClick={() => openAdjustment(product, "reduce")}
                          disabled={product.quantity === 0}
                          className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ArrowDown size={13} /> Remove
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {adjustment ? (
        <StockAdjustmentModal
          adjustment={adjustment}
          quantity={quantity}
          note={note}
          error={error}
          onQuantityChange={(value) => {
            setQuantity(value);
            setError("");
          }}
          onNoteChange={setNote}
          onClose={() => setAdjustment(null)}
          onConfirm={handleAdjust}
        />
      ) : null}
    </div>
  );
}
