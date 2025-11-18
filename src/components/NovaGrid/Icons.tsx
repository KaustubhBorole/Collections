export function SortIcon({ state }: { state?: "asc" | "desc" }) {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center">
      {state === "asc" && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path d="M7 14l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      {state === "desc" && (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      {!state && (
        <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-40" aria-hidden>
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
    </span>
  );
}

export function FunnelIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${active ? "opacity-100" : "opacity-60"}`} aria-hidden>
      <path d="M3 5h18l-7 8v5l-4 1v-6L3 5z" fill="currentColor" />
    </svg>
  );
}

export function ColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M4 5h4v14H4zM10 5h4v14h-4zM16 5h4v14h-4z" fill="currentColor" />
    </svg>
  );
}

export function BroomIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor" />
    </svg>
  );
}

export function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M5 11h14v2H5z" fill="currentColor" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="currentColor" />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.75 10h-2.1A6 6 0 1 1 12 6c1.3 0 2.5.42 3.47 1.13L13 10h7V3l-2.35 3.35z" fill="currentColor" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M12 3v10m0 0l4-4m-4 4l-4-4M5 20h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
