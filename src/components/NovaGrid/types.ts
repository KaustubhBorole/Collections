export type ColumnDef<T> = {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: "string" | "number" | "date" | "boolean";
  render?: (value: any, row: T) => React.ReactNode;
};

export type DataGridProps<T extends { id: string | number }> = {
  columns?: ColumnDef<T>[];
  data?: T[];
  initialSort?: { key: keyof T & string; dir: "asc" | "desc" } | null;
  onSelectionChange?: (ids: Array<string | number>) => void;
  className?: string;
};
