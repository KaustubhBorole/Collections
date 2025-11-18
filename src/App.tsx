import { NovaGrid, ColumnDef } from "./components/NovaGrid";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  startDate: string;
  active: boolean;
};

const DEMO_DATA: Person[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  firstName: ["Ava", "Ben", "Cara", "Dev", "Ella", "Finn", "Gia", "Hugo"][i % 8],
  lastName: ["Ng", "Patel", "Lopez", "Kim", "Rossi", "Novak"][i % 6],
  age: 20 + ((i * 7) % 40),
  startDate: new Date(2020, (i * 3) % 12, (i * 5) % 28 + 1).toISOString(),
  active: i % 3 === 0,
}));

const DEMO_COLS: ColumnDef<Person>[] = [
  { key: "firstName", header: "First Name", sortable: true, filterable: true, type: "string" },
  { key: "lastName", header: "Last Name", sortable: true, filterable: true, type: "string" },
  { key: "age", header: "Age", sortable: true, filterable: true, type: "number" },
  {
    key: "startDate",
    header: "Start Date",
    sortable: true,
    filterable: true,
    type: "date",
    render: (v) => new Date(v).toLocaleDateString(),
  },
  {
    key: "active",
    header: "Active",
    sortable: true,
    filterable: true,
    type: "boolean",
    render: (v: boolean) => (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
          v ? "" : "opacity-60"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${v ? "bg-green-600" : "bg-gray-400"}`}
        />
        {v ? "Yes" : "No"}
      </span>
    ),
  },
];

function App() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-4 text-2xl font-semibold">Nova Grid – React Data Grid</h1>
        <NovaGrid
          data={DEMO_DATA}
          columns={DEMO_COLS}
          initialSort={{ key: "firstName", dir: "asc" }}
        />
      </div>
    </div>
  );
}

export default App;
