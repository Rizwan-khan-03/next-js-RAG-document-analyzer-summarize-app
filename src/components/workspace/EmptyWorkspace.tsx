import { FolderOpen } from "lucide-react";

export default function EmptyWorkspace() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <FolderOpen
        className="mb-4 text-slate-600"
        size={48}
      />

      <h3 className="text-lg font-semibold text-white">
        Empty Workspace
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        Add one or more documents to start comparing
        them with AI.
      </p>
    </div>
  );
}