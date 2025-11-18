import React from "react";

export function FilterDropdown({
  values,
  selected,
  onChange,
  onClose,
  maxWidthPx,
  maxHeightPx,
  side,
}: {
  values: string[];
  selected: Set<string>;
  onChange: (s: Set<string>) => void;
  onClose: () => void;
  maxWidthPx?: number;
  maxHeightPx?: number;
  side?: 'left' | 'right';
}) {
  const [local, setLocal] = React.useState<Set<string>>(new Set(selected));
  const [q, setQ] = React.useState("");
  const [width, setWidth] = React.useState(14);
  const [height, setHeight] = React.useState(20);
  const [resizing, setResizing] = React.useState(false);
  const currentSide = side ?? 'right';

  React.useEffect(() => setLocal(new Set(selected)), [selected]);
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return values;
    return values.filter((v) => v.toLowerCase().includes(s));
  }, [q, values]);

  const toggle = (v: string) => {
    const next = new Set(local);
    next.has(v) ? next.delete(v) : next.add(v);
    setLocal(next);
  };

  const onApply = () => {
    onChange(new Set(local));
    onClose();
  };
  const onClear = () => {
    const empty = new Set<string>();
    setLocal(empty);
    onChange(empty);
  };

  const startResize = () => setResizing(true);
  const stopResize = () => setResizing(false);
  const handleResize = (e: MouseEvent) => {
    if (!resizing) return;
    setWidth((w) => {
      const delta = currentSide === 'right' ? e.movementX / 8 : -e.movementX / 8;
      const next = Math.max(12, w + delta);
      return maxWidthPx ? Math.min(next, maxWidthPx / 16) : next;
    });
    setHeight((h) => {
      const next = Math.max(14, h + e.movementY / 8);
      return maxHeightPx ? Math.min(next, maxHeightPx / 16) : next;
    });
  };

  React.useEffect(() => {
    if (resizing) window.addEventListener("mousemove", handleResize);
    else window.removeEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [resizing, maxWidthPx, maxHeightPx, currentSide]);

  return (
    <div
      className="z-50 rounded-lg border bg-white p-2 shadow-xl relative"
      style={{ width: `${width}rem`, height: `${height}rem`, maxWidth: maxWidthPx ? `${maxWidthPx}px` : undefined, maxHeight: maxHeightPx ? `${maxHeightPx}px` : undefined }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center gap-2">
        <input
          placeholder="Find value…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border px-2 py-1 text-xs focus:outline-none focus:ring"
        />
      </div>
      <div className="overflow-auto pr-1" style={{ height: `calc(${height}rem - 3.25rem)` }}>
        {filtered.length === 0 && (
          <div className="p-2 text-xs text-gray-500">No values</div>
        )}
        {filtered.map((v) => (
          <label key={v} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-black/5">
            <input
              type="checkbox"
              className="h-3.5 w-3.5"
              checked={local.has(v)}
              onChange={() => toggle(v)}
            />
            <span className="truncate text-xs" title={v}>{v || "<empty>"}</span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <button onClick={onClear} className="rounded-md border px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600">Clear</button>
        <button onClick={onApply} className="rounded-md border px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600">Apply</button>
      </div>
      <div
        onMouseDown={startResize}
        className={`absolute bottom-0 ${currentSide === 'right' ? 'right-0 cursor-se-resize' : 'left-0 cursor-sw-resize'} h-3 w-3 bg-gray-300 rounded-tl-sm`}
        title="Drag to resize"
      />
    </div>
  );
}
