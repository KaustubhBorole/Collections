import { ColumnDef } from "./types";

export const normalize = (v: unknown) => (v == null ? "" : String(v).toLowerCase());

export const compare = (a: any, b: any, type: ColumnDef<any>["type"]) => {
  if (type === "number") {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isNaN(na) && Number.isNaN(nb)) return 0;
    if (Number.isNaN(na)) return 1;
    if (Number.isNaN(nb)) return -1;
    return na - nb;
  }
  if (type === "date") {
    const da = a ? new Date(a).getTime() : 0;
    const db = b ? new Date(b).getTime() : 0;
    return da - db;
  }
  if (type === "boolean") return (a ? 1 : 0) - (b ? 1 : 0);
  return normalize(a).localeCompare(normalize(b));
};
