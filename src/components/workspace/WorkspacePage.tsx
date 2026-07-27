"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, FolderOpen } from "lucide-react";
import ChatPanel from "../chat/ChatPanel";
import PdfViewer from "../pdf/PdfViewer";
import WorkspaceDocuments from "./WorkspaceDocuments";
import WorkspaceSidebar from "./WorkspaceSidebar";
import type { Workspace, WorkspaceDocument } from "./types";

type DocumentResponse = {
  id: string;
  fileName: string;
  filePath: string;
};

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [availableDocuments, setAvailableDocuments] = useState<WorkspaceDocument[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<string>();
  const [selectedDocument, setSelectedDocument] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightText, setHighlightText] = useState("");

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspace),
    [activeWorkspace, workspaces]
  );
  const activeDocument = selectedWorkspace?.documents.find((document) => document.id === selectedDocument);

  useEffect(() => {
    void loadWorkspaces();
    void loadAvailableDocuments();
  }, []);

  async function loadWorkspaces(preferredWorkspaceId?: string) {
    const response = await fetch("/api/workspace");
    if (!response.ok) return [];

    const data = (await response.json()) as Omit<Workspace, "selected">[];
    const nextActiveWorkspace = data.some((workspace) => workspace.id === preferredWorkspaceId)
      ? preferredWorkspaceId
      : data.some((workspace) => workspace.id === activeWorkspace)
        ? activeWorkspace
        : data[0]?.id;

    const nextWorkspaces = data.map((workspace) => ({
      ...workspace,
      selected: workspace.id === nextActiveWorkspace,
    }));
    const nextSelectedWorkspace = nextWorkspaces.find((workspace) => workspace.id === nextActiveWorkspace);

    setWorkspaces(nextWorkspaces);
    setActiveWorkspace(nextActiveWorkspace);
    setSelectedDocument((current) => (
      nextSelectedWorkspace?.documents.some((document) => document.id === current)
        ? current
        : nextSelectedWorkspace?.documents[0]?.id
    ));
    return nextWorkspaces;
  }

  async function loadAvailableDocuments() {
    const response = await fetch("/api/documents");
    if (!response.ok) return;

    const data = (await response.json()) as DocumentResponse[];
    setAvailableDocuments(data.map((document) => ({
      id: document.id,
      title: document.fileName,
      pages: 0,
      fileUrl: document.filePath,
    })));
  }

  function selectWorkspace(id: string) {
    const workspace = workspaces.find((item) => item.id === id);
    setActiveWorkspace(id);
    setSelectedDocument(workspace?.documents[0]?.id);
    setCurrentPage(1);
    setHighlightText("");
    setWorkspaces((current) => current.map((item) => ({ ...item, selected: item.id === id })));
  }

  async function createWorkspace() {
    const response = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Workspace ${workspaces.length + 1}` }),
    });
    if (!response.ok) return;

    const workspace = (await response.json()) as Workspace;
    await loadWorkspaces(workspace.id);
    setSelectedDocument(undefined);
    setCurrentPage(1);
    setHighlightText("");
  }

  async function deleteWorkspace(id: string) {
    const response = await fetch(`/api/workspace/${id}`, { method: "DELETE" });
    if (!response.ok) return;

    const nextWorkspaces = await loadWorkspaces(id === activeWorkspace ? undefined : activeWorkspace);
    if (id === activeWorkspace) {
      setSelectedDocument(nextWorkspaces[0]?.documents[0]?.id);
      setCurrentPage(1);
      setHighlightText("");
    }
  }

  async function addDocument(document: WorkspaceDocument) {
    if (!activeWorkspace) return;
    const response = await fetch(`/api/workspace/${activeWorkspace}/document`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: document.id }),
    });
    if (!response.ok) return;

    await loadWorkspaces(activeWorkspace);
    setSelectedDocument(document.id);
    setCurrentPage(1);
    setHighlightText("");
  }

  async function removeDocument(documentId: string) {
    if (!activeWorkspace) return;
    const response = await fetch(`/api/workspace/${activeWorkspace}/document/${documentId}`, {
      method: "DELETE",
    });
    if (!response.ok) return;

    const nextWorkspaces = await loadWorkspaces(activeWorkspace);
    if (selectedDocument === documentId) {
      const workspace = nextWorkspaces.find((item) => item.id === activeWorkspace);
      setSelectedDocument(workspace?.documents[0]?.id);
      setCurrentPage(1);
      setHighlightText("");
    }
  }

  function selectDocument(id: string) {
    setSelectedDocument(id);
    setCurrentPage(1);
    setHighlightText("");
  }

  return (
    <main className="h-screen bg-slate-950 p-2 text-white">
      <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl lg:grid-cols-[220px_minmax(320px,1fr)_280px_minmax(380px,1.2fr)]">
        <WorkspaceSidebar
          workspaces={workspaces}
          onSelect={selectWorkspace}
          onRemove={deleteWorkspace}
          onAdd={createWorkspace}
          onRename={() => undefined}
        />

        <section className="flex min-h-0 flex-col border-r border-slate-700 bg-slate-900">
          <header className="border-b border-slate-700 p-4">
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <p className="mt-1 text-xs text-slate-400">Workspace chat will be available in a future update.</p>
          </header>
          <div className="min-h-0 flex-1">
            {activeDocument ? (
              <ChatPanel
                documentId={activeDocument.id}
                onSourceSelect={(source) => {
                  setCurrentPage(source.pageNumber);
                  setHighlightText(source.content);
                }}
              />
            ) : (
              <EmptyPanel message="Select a document to start chatting." />
            )}
          </div>
        </section>

        <WorkspaceDocuments
          workspace={selectedWorkspace}
          selectedDocumentId={selectedDocument}
          availableDocuments={availableDocuments}
          onAddDocument={addDocument}
          onRemoveDocument={removeDocument}
          onSelectDocument={selectDocument}
        />

        <section className="min-h-0 overflow-hidden bg-white">
          {activeDocument ? (
            <PdfViewer fileUrl={activeDocument.fileUrl} pageNumber={currentPage} highlightText={highlightText} />
          ) : (
            <EmptyPanel message="Select a document to preview its PDF." light />
          )}
        </section>
      </div>
    </main>
  );
}

function EmptyPanel({ message, light = false }: { message: string; light?: boolean }) {
  return (
    <div className={`flex h-full flex-col items-center justify-center p-6 text-center ${light ? "bg-slate-100" : ""}`}>
      {light ? <FileText className="mb-3 text-slate-400" size={40} /> : <FolderOpen className="mb-3 text-slate-600" size={40} />}
      <p className={light ? "text-sm text-slate-500" : "text-sm text-slate-400"}>{message}</p>
    </div>
  );
}
