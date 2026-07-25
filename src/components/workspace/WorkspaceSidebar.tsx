"use client";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceItem from "./WorkspaceItem";
import EmptyWorkspace from "./EmptyWorkspace";
import { Workspace } from "./types";

interface WorkspaceSidebarProps {
  workspaces: Workspace[];

  onSelect(id: string): void;

  onRemove(id: string): void;

  onAdd(): void;
}

export default function WorkspaceSidebar({
  workspaces,
  onSelect,
  onRemove,
  onAdd,
}: WorkspaceSidebarProps) {
  return (
    <aside className="flex h-full flex-col border-r border-slate-700 bg-slate-950">
      <WorkspaceHeader
        count={workspaces.length}
        onAdd={onAdd}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {workspaces.length === 0 ? (
          <EmptyWorkspace />
        ) : (
          workspaces.map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              workspace={workspace}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </aside>
  );
}