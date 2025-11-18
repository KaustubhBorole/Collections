import { useState, useEffect, useMemo } from "react";
import { DataGridProps, ColumnDef } from "./types";
import { normalize, compare } from "./utils";
import { useDebounced } from "./hooks";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { IconButton } from "./IconButton";
import { Popover } from "./Popover";
import { FilterDropdown } from "./FilterDropdown";
import { ColumnVisibilityPanel } from "./ColumnVisibilityPanel";
import {
  SortIcon,
  FunnelIcon,
  ColumnsIcon,
  BroomIcon,
  PlusIcon,
  MinusIcon,
  EyeIcon,
  DownloadIcon,
  RefreshIcon,
} from "./Icons";

export function NovaGrid<T extends { id: string | number }>(props: DataGridProps<T>) {
  const {
    columns: columnsProp,
    data: dataProp,
    initialSort = null,
    onSelectionChange,
    className,
  } = props;

  const safeColumns: ColumnDef<T>[] = Array.isArray(columnsProp) ? columnsProp : [];
  const safeData: T[] = Array.isArray(dataProp) ? dataProp : [];

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [valueFilters, setValueFilters] = useState<Record<string, Set<string>>>({});
  const [openFilterFor, setOpenFilterFor] = useState<string | null>(null);
  const [openFilterAnchor, setOpenFilterAnchor] = useState<DOMRect | null>(null);
  const [sort, setSort] = useState<typeof initialSort>(initialSort);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const [visibleCols, setVisibleCols] = useState<Set<string>>(
    new Set((safeColumns ?? []).map((c) => c.key as string))
  );
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const [colVisAnchor, setColVisAnchor] = useState<DOMRect | null>(null);
  useEffect(() => {
    setVisibleCols(new Set((safeColumns ?? []).map((c) => c.key as string)));
  }, [safeColumns.length]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useDebounced(search, 250);

  const uniqueValues = useMemo(() => {
    const map: Record<string, string[]> = {};
    (safeColumns ?? []).forEach((col) => {
      const set = new Set<string>();
      (safeData ?? []).forEach((row) => {
        const v = (row as any)[col.key];
        const s = col.type === "boolean" ? String(Boolean(v)) : String(v ?? "");
        set.add(s);
      });
      map[col.key] = Array.from(set).sort();
    });
    return map;
  }, [safeColumns, safeData]);

  const filteredRows = useMemo(() => {
    const s = debouncedSearch.trim().toLowerCase();

    let rows = (safeData ?? []).filter((row) => {
      if (!s) return true;
      return (safeColumns ?? []).some((col) => normalize((row as any)[col.key]).includes(s));
    });

    rows = rows.filter((row) =>
      (safeColumns ?? []).every((col) => {
        const text = (filters[col.key] || "").trim().toLowerCase();
        const v = (row as any)[col.key];

        const picked = valueFilters[col.key];
        if (picked && picked.size > 0 && !picked.has(String(v ?? ""))) return false;

        if (!text) return true;
        if (col.type === "number") return String(v) === text;
        if (col.type === "boolean") return String(Boolean(v)) === text;
        return normalize(v).includes(text);
      })
    );

    if (showOnlySelected) {
      rows = rows.filter((row) => selected.has(row.id));
    }

    if (sort) {
      if (sort.key === '__selection__') {
        rows = [...rows].sort((a, b) => {
          const aSelected = selected.has(a.id) ? 1 : 0;
          const bSelected = selected.has(b.id) ? 1 : 0;
          const cmp = aSelected - bSelected;
          return (sort as any).dir === "asc" ? cmp : -cmp;
        });
      } else {
        const { key, dir } = sort as { key: keyof T & string; dir: "asc" | "desc" };
        const col = (safeColumns ?? []).find((c) => c.key === key);
        const t = col?.type || "string";
        rows = [...rows].sort((a, b) => {
          const cmp = compare((a as any)[key], (b as any)[key], t);
          return dir === "asc" ? cmp : -cmp;
        });
      }
    }

    return rows;
  }, [safeData, safeColumns, debouncedSearch, filters, valueFilters, sort, showOnlySelected, selected]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters, valueFilters, sort, pageSize]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const padCount = useMemo(() => {
    const minimal = filteredRows.length === 0 ? 1 : 0;
    const count = pageSize - (pagedRows.length || minimal);
    return count > 0 ? count : 0;
  }, [pagedRows.length, pageSize, filteredRows.length]);

  const renderColumns = useMemo(
    () => (safeColumns ?? []).filter((c) => visibleCols.has(c.key as string)),
    [safeColumns, visibleCols]
  );

  const visibleIds = useMemo(() => pagedRows.map((r) => r.id), [pagedRows]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));
  const toggleSelectAllVisible = () => {
    const next = new Set(selected);
    if (allVisibleSelected) visibleIds.forEach((id) => next.delete(id));
    else visibleIds.forEach((id) => next.add(id));
    setSelected(next);
  };
  const toggleRow = (id: string | number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

  const onHeaderClick = (col: ColumnDef<T>) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" } as any;
      if (prev.dir === "asc") return { key: col.key, dir: "desc" } as any;
      return null;
    });
  };

  const onSelectionSort = () => {
    setSort((prev) => {
      if (!prev || prev.key !== '__selection__') return { key: '__selection__' as any, dir: "desc" } as any;
      if (prev.dir === "desc") return { key: '__selection__' as any, dir: "asc" } as any;
      return null;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setFilters({});
    setValueFilters({});
    setOpenFilterFor(null);
    setOpenFilterAnchor(null);
    setSort(null);
    setPage(1);
    setShowOnlySelected(false);
  };

  return (
    <div className={"w-full " + (className ?? "")}> 
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all columns…"
            className="w-64 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring"
          />
          <button onClick={clearFilters} className="rounded-xl border px-3 py-2 text-sm hover:bg-black/5" title="Clear search & filters">Clear</button>
          {selected.size > 0 && (
            <div className="text-sm text-gray-600">
              Selected: {selected.size} row{selected.size !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <IconButton title="Clear Filters" onClick={clearFilters}><BroomIcon /></IconButton>
          <IconButton title="Download"><DownloadIcon /></IconButton>
          <IconButton title="Refresh Grid"><RefreshIcon /></IconButton>
          <IconButton
            title="Column Visibility"
            onMouseDown={(e) => setColVisAnchor((e.currentTarget as HTMLElement).getBoundingClientRect())}
            onClick={() => setColMenuOpen((o) => !o)}
          >
            <ColumnsIcon />
          </IconButton>
        </div>
      </div>

      {colMenuOpen && colVisAnchor && (
        <Popover anchorRect={colVisAnchor} onClose={() => setColMenuOpen(false)}>
          {({ maxWidthPx, maxHeightPx }) => (
            <div className="z-50 rounded-lg border bg-white p-2 shadow-xl" style={{ maxWidth: maxWidthPx, maxHeight: maxHeightPx }} onMouseDown={(e) => e.stopPropagation()}>
              <ColumnVisibilityPanel
                columns={(safeColumns ?? []).map((c) => ({ key: c.key as string, header: c.header }))}
                visible={visibleCols}
                onChange={(set) => setVisibleCols(new Set(set))}
                onClose={() => setColMenuOpen(false)}
              />
            </div>
          )}
        </Popover>
      )}

      <div className="overflow-auto rounded-2xl border" style={{ maxHeight: '600px' }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-left">
              <th className="w-10 p-3 align-top bg-gray-50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <IndeterminateCheckbox
                      checked={allVisibleSelected}
                      indeterminate={!allVisibleSelected && someVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      title={allVisibleSelected ? "Unselect visible" : "Select all visible"}
                    />
                    <span className="cursor-pointer" onClick={onSelectionSort}>
                      <SortIcon state={sort?.key === '__selection__' ? (sort as any).dir : undefined} />
                    </span>
                  </div>
                  <button
                    className={`rounded-md border px-2 py-1 text-xs hover:bg-black/5 ${showOnlySelected ? "bg-primary text-primary-foreground" : ""}`}
                    title={showOnlySelected ? "Show all rows" : "Show only selected rows"}
                    onClick={() => setShowOnlySelected((prev) => !prev)}
                  >
                    <FunnelIcon active={showOnlySelected} />
                  </button>
                </div>
              </th>
              {renderColumns.map((col) => (
                <th key={col.key} className="p-3 font-semibold select-none bg-gray-50">
                  <div className="flex items-center gap-1">
                    <span
                      className={col.sortable ? "cursor-pointer hover:text-primary" : ""}
                      onClick={() => col.sortable && onHeaderClick(col)}
                    >
                      {col.header}
                    </span>
                    {col.sortable && (
                      <span className="cursor-pointer" onClick={() => onHeaderClick(col)}>
                        <SortIcon state={sort?.key === col.key ? (sort as any).dir : undefined} />
                      </span>
                    )}
                  </div>
                  {col.filterable && (
                    <div className="mt-2 relative flex items-center gap-2">
                      <input
                        value={filters[col.key] || ""}
                        onChange={(e) => setFilters((f) => ({ ...f, [col.key]: e.target.value }))}
                        placeholder={col.type === "number" ? "= value" : col.type === "boolean" ? "true | false" : "contains…"}
                        className="w-full rounded-lg border px-2 py-1 text-xs focus:outline-none focus:ring"
                      />
                      <button
                        className={`relative rounded-md border px-2 py-1 text-xs hover:bg-black/5 ${valueFilters[col.key]?.size ? "ring-1" : ""}`}
                        title="Filter by values"
                        onMouseDown={(e) => setOpenFilterAnchor((e.currentTarget as HTMLElement).getBoundingClientRect())}
                        onClick={() => setOpenFilterFor((k) => (k === col.key ? null : col.key))}
                      >
                        <FunnelIcon active={Boolean(valueFilters[col.key]?.size)} />
                      </button>
                      {openFilterFor === col.key && openFilterAnchor && (
                        <Popover anchorRect={openFilterAnchor} onClose={() => setOpenFilterFor(null)}>
                          {({ maxWidthPx, maxHeightPx, side }) => (
                            <FilterDropdown
                              values={uniqueValues[col.key] || []}
                              selected={valueFilters[col.key] ?? new Set()}
                              onChange={(set) => setValueFilters((prev) => ({ ...prev, [col.key]: set }))}
                              onClose={() => setOpenFilterFor(null)}
                              maxWidthPx={maxWidthPx}
                              maxHeightPx={maxHeightPx}
                              side={side}
                            />
                          )}
                        </Popover>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row) => (
              <tr key={String(row.id)} className="border-t hover:bg-black/5">
                <td className="p-3 align-middle">
                  <input type="checkbox" className="h-4 w-4" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} />
                </td>
                {renderColumns.map((col) => {
                  const v = (row as any)[col.key];
                  return (
                    <td key={col.key} className="p-3 align-middle">
                      {col.render ? col.render(v, row) : String(v ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}

            {Array.from({ length: padCount }).map((_, i) => (
              <tr key={`pad-${i}`} className="border-t">
                <td className="p-3">&nbsp;</td>
                {renderColumns.map((col) => (<td key={`pad-${i}-${col.key}`} className="p-3">&nbsp;</td>))}
              </tr>
            ))}

            {filteredRows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={renderColumns.length + 1}>No rows match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm text-gray-700">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        
        <div className="text-sm text-gray-600">
          {filteredRows.length === 0 ? (
            "0 to 0 of 0"
          ) : (
            `${(page - 1) * pageSize + 1} to ${Math.min(page * pageSize, filteredRows.length)} of ${filteredRows.length}`
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-auto">
          <button
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPage(1)}
            disabled={page === 1}
            title="First page"
          >
            «
          </button>
          <button
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            title="Previous page"
          >
            ‹
          </button>
          <div className="px-3 py-1 text-sm text-gray-700">
            Page {page} of {pageCount}
          </div>
          <button
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            title="Next page"
          >
            ›
          </button>
          <button
            className="rounded-md border border-gray-300 px-2 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => setPage(pageCount)}
            disabled={page === pageCount}
            title="Last page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
