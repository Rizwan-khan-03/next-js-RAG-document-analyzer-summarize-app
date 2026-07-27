import { FileText, Trash2 } from "lucide-react";
import type { WorkspaceDocument } from "./types";

interface WorkspaceDocumentItemProps {
  document: WorkspaceDocument;
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function WorkspaceDocumentItem({
  document,
  selected,
  onSelect,
  onRemove,
}: WorkspaceDocumentItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(document.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(document.id);
        }
      }}
      className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
        selected
          ? "border-blue-500 bg-blue-500/10"
          : "border-slate-700 bg-slate-900/50 hover:bg-slate-800"
      }`}
    >
      <FileText className="shrink-0 text-blue-400" size={18} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-100">{document.title}</p>
        <p className="mt-0.5 text-xs text-slate-400">{document.pages} pages</p>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove(document.id);
        }}
        className="rounded-md p-2 text-slate-500 opacity-0 transition hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Remove ${document.title} from workspace`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
