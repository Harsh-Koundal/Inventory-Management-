import { Edit, Package, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import SearchBar from "../../components/ui/SearchBar";
import SelectField from "../../components/ui/SelectField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../components/table/Table";
import { CATEGORIES } from "../../constants/options";
import { useInventory } from "../../hooks/useInventory";
import ConfirmationDialog from "../../modals/ConfirmationDialog";
import { formatCurrency } from "../../utils/format";
import { getStockStatus } from "../../utils/inventory";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";

export default function Products() {
  const { deleteProduct, products, showToast } = useInventory();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const query = search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query);
        const matchesCategory =
          categoryFilter === "All" || product.category === categoryFilter;

        return matchesSearch && matchesCategory;
      }),
    [categoryFilter, products, search]
  );

  const productToDelete = products.find((product) => product.id === deleteId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or SKU..."
          className="flex-1"
        />
        <SelectField
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="bg-white"
        >
          {["All", ...CATEGORIES].map((category) => (
            <option key={category}>{category}</option>
          ))}
        </SelectField>
        <Button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold"
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">
          {filteredProducts.length} of {products.length} products
        </span>
        {search || categoryFilter !== "All" ? (
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
            }}
            className="text-xs font-medium text-indigo-500 hover:text-indigo-700"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            message="No products found"
            sub="Try adjusting your search or category filter"
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow className="border-b border-gray-100 bg-gray-50">
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell align="right">Price</TableHeaderCell>
                <TableHeaderCell align="right">Stock</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity, product.minStock);

                return (
                  <TableRow key={product.id} className="group transition-colors hover:bg-indigo-50/30">
                    <TableCell className="font-mono text-xs font-medium text-gray-400">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-gray-900">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`text-base font-black tabular-nums ${
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
                    <TableCell>
                      <Badge type={status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-100 sm:group-hover:opacity-100">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="rounded-lg p-1.5 text-indigo-500 transition-colors hover:bg-indigo-100"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={15} />
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

      <CreateProduct
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(message) => showToast(message, "success")}
      />
      <EditProduct
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdated={(message) => showToast(message, "success")}
      />

      {deleteId ? (
        <ConfirmationDialog
          title="Delete Product"
          icon={Trash2}
          iconWrapperClassName="bg-red-100"
          iconClassName="text-red-600"
          message={`Delete "${productToDelete?.name}"?`}
          description="This action is permanent and cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmClassName="bg-red-600 hover:bg-red-700"
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            const result = await deleteProduct(deleteId);
            showToast(result.message, result.ok ? "success" : "error");
            setDeleteId(null);
          }}
        />
      ) : null}
    </div>
  );
}
