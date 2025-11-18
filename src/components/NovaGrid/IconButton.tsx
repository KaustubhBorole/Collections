import React from "react";

export function IconButton({
  title,
  children,
  onClick,
  onMouseDown,
}: {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className="rounded-xl border px-3 py-2 text-sm hover:bg-black/5 inline-flex items-center justify-center gap-2"
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
}
