import React, { useEffect } from "react";

export function ColumnVisibilityPanel({
  columns,
  visible,
  onChange,
  onClose,
}: {
  columns: { key: string; header: string }[];
  visible: Set<string>;
  onChange: (next: Set<string>) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = React.useState<Set<string>>(new Set(visible));
  useEffect(() => setLocal(new Set(visible)), [visible]);
  const toggle = (k: string) => {
    const next = new Set(local);
    next.has(k) ? next.delete(k) : next.add(k);
    setLocal(next);
  };
  const showAll = () => setLocal(new Set(columns.map((c) => c.key)));
  const apply = () => {
    onChange(local);
    onClose();
  };
  return (
    <div className="w-64" onMouseDown={(e) => e.stopPropagation()}>
      <div className="mb-2 flex items-center justify-between">
        <strong className="text-sm">Columns</strong>
        <div className="flex gap-2">
          <button className="rounded-md border px-2 py-0.5 text-xs hover:bg-black/5" onClick={showAll}>Show all</button>
        </div>
      </div>
      <div className="max-h-64 overflow-auto pr-1">
        {columns.map((c) => (
          <label key={c.key} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-black/5 cursor-pointer">
            <input type="checkbox" className="h-3.5 w-3.5" checked={local.has(c.key)} onChange={() => toggle(c.key)} />
            <span className="text-sm truncate" title={c.header}>{c.header}</span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button className="rounded-md border px-2 py-1 text-xs" onClick={onClose}>Cancel</button>
        <button className="rounded-md border px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600" onClick={apply}>Apply</button>
      </div>
    </div>
  );
}
