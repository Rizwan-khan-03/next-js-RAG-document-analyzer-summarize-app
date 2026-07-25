interface WorkspaceHeaderProps {
  count: number;
  onAdd?: (data:any) => void;
}

export default function WorkspaceHeader({
  count,
  onAdd,
}: WorkspaceHeaderProps) {
  return (
    <div className="border-b border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Workspace
          </h2>

          <p className="text-xs text-slate-400">
            {count} document{count !== 1 && "s"}
          </p>
        </div>

        <button
          onClick={onAdd}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
        >
          + Add
        </button>
      </div>
    </div>
  );
}