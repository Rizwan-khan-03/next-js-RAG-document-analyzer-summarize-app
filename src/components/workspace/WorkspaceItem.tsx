import { Folder, Pencil, Trash2 } from "lucide-react";
import { Workspace } from "./types";

interface Props {
  workspace: Workspace;

  onSelect(id: string): void;

  onRemove(id: string): void;

  onRename?(id: string): void;
}

export default function WorkspaceItem({
  workspace,
  onSelect,
  onRemove,
  onRename,
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

        <div className="flex items-center">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onRename?.(workspace.id);
            }}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
            aria-label={`Rename ${workspace.title}`}
            title="Rename workspace"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onRemove(workspace.id);
            }}
            className="rounded-md p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
            aria-label={`Delete ${workspace.title}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
