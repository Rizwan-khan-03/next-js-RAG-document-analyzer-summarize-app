"use client";

import { FilePlus2, Files, X } from "lucide-react";
import WorkspaceDocumentItem from "./WorkspaceDocumentItem";
import type { Workspace, WorkspaceDocument } from "./types";

interface WorkspaceDocumentsProps {
  workspace?: Workspace;
  selectedDocumentId?: string;
  availableDocuments: WorkspaceDocument[];
  onAddDocument: (document: WorkspaceDocument) => void;
  onRemoveDocument: (documentId: string) => void;
  onSelectDocument: (documentId: string) => void;
}

export default function WorkspaceDocuments({
  workspace,
  selectedDocumentId,
  availableDocuments,
  onAddDocument,
  onRemoveDocument,
  onSelectDocument,
}: WorkspaceDocumentsProps) {
  const workspaceDocumentIds = new Set(workspace?.documents.map((document) => document.id));
  const documentsToAdd = availableDocuments.filter((document) => !workspaceDocumentIds.has(document.id));

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-slate-700 bg-slate-950">
      <div className="border-b border-slate-700 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Documents</h2>
            <p className="mt-1 text-xs text-slate-400">
              {workspace ? workspace.title : "Select a workspace"}
            </p>
          </div>
          {workspace ? (
            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
              {workspace.documents.length}
            </span>
          ) : null}
        </div>
      </div>

      {!workspace ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Files className="mb-3 text-slate-600" size={40} />
          <p className="text-sm text-slate-400">Create or select a workspace to add documents.</p>
        </div>
      ) : (
        <>
          <div className="border-b border-slate-800 p-3">
            {documentsToAdd.length ? (
              <div className="space-y-2">
                <p className="px-1 text-xs font-medium uppercase tracking-wide text-slate-500">Add document</p>
                {documentsToAdd.map((document) => (
                  <button
                    key={document.id}
                    type="button"
                    onClick={() => onAddDocument(document)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <FilePlus2 size={16} className="text-blue-400" />
                    <span className="truncate">{document.title}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="flex items-center gap-2 px-1 py-2 text-xs text-slate-500">
                <X size={14} /> All local documents have been added
              </p>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {workspace.documents.length ? (
              workspace.documents.map((document) => (
                <WorkspaceDocumentItem
                  key={document.id}
                  document={document}
                  selected={document.id === selectedDocumentId}
                  onSelect={onSelectDocument}
                  onRemove={onRemoveDocument}
                />
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                <Files className="mb-3 text-slate-600" size={36} />
                <p className="text-sm text-slate-400">Add a document to begin.</p>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
