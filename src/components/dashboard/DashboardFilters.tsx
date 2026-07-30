const filters = [
  "All",
  "Processed",
  "Uploading",
  "Failed",
];

export default function DashboardFilters() {
  return (
    <div className="flex gap-3">
      {filters.map((item) => (
        <button
          key={item}
          className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
        >
          {item}
        </button>
      ))}
    </div>
  );
}