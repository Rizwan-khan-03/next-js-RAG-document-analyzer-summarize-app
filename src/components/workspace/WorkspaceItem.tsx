import { Trash2, Folder } from "lucide-react";
import { Workspace } from "./types";

interface Props {
  workspace: Workspace;

  onSelect(id: string): void;

  onRemove(id: string): void;
}

export default function WorkspaceItem({
  workspace,
  onSelect,
  onRemove,
}: Props) {
  return (
    <div
      onClick={() => onSelect(workspace.id)}
      className={`cursor-pointer rounded-lg border p-3 transition
      ${
        workspace.selected
          ? "border-blue-500 bg-slate-800"
          : "border-slate-700 hover:bg-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="text-blue-400" size={18} />

          <div>
            <p className="text-sm font-medium text-white">
              {workspace.title}
            </p>

            <p className="text-xs text-slate-400">
              {workspace.documents.length} documents
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(workspace.id);
          }}
          className="rounded-md p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}