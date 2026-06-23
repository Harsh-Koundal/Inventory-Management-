import { ArrowDown, ArrowUp, History as HistoryIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import SearchBar from "../../components/ui/SearchBar";
import SelectField from "../../components/ui/SelectField";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../../components/table/Table";
import { HISTORY_ACTION_OPTIONS } from "../../constants/options";
import { useInventory } from "../../hooks/useInventory";
import { formatDate } from "../../utils/format";

export default function StockHistory() {
  const { history } = useInventory();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const filteredHistory = useMemo(() => {
    const query = search.toLowerCase();

    return [...history]
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          item.note.toLowerCase().includes(query);
        const matchesAction = actionFilter === "All" || item.action === actionFilter;

        return matchesSearch && matchesAction;
      });
  }, [actionFilter, history, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search history..."
          className="flex-1"
        />
        <SelectField
          value={actionFilter}
          onChange={(event) => setActionFilter(event.target.value)}
          className="bg-white"
        >
          {HISTORY_ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{filteredHistory.length} events</span>
        {search || actionFilter !== "All" ? (
          <button
            onClick={() => {
              setSearch("");
              setActionFilter("All");
            }}
            className="text-xs font-medium text-indigo-500 hover:text-indigo-700"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {filteredHistory.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            message="No history found"
            sub="Every stock movement appears here"
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow className="border-b border-gray-100 bg-gray-50">
                <TableHeaderCell>Timestamp</TableHeaderCell>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
                <TableHeaderCell align="right">Change</TableHeaderCell>
                <TableHeaderCell>Notes</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id} className="transition-colors hover:bg-gray-50">
                  <TableCell className="whitespace-nowrap text-xs text-gray-400">
                    {formatDate(item.ts)}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">{item.name}</TableCell>
                  <TableCell>
                    <Badge type={item.action} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.qty > 0 ? (
                        <ArrowUp size={13} className="text-emerald-500" />
                      ) : (
                        <ArrowDown size={13} className="text-red-400" />
                      )}
                      <span
                        className={`font-black tabular-nums ${
                          item.qty > 0 ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {item.qty > 0 ? "+" : ""}
                        {item.qty}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-gray-400">
                    {item.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
