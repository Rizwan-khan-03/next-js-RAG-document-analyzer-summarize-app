"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, FolderOpen } from "lucide-react";
import PdfViewer from "../pdf/PdfViewer";
import WorkspaceChatPanel from "./WorkspaceChatPanel";
import WorkspaceChatSidebar from "./WorkspaceChatSidebar";
import WorkspaceDocuments from "./WorkspaceDocuments";
import WorkspaceSidebar from "./WorkspaceSidebar";
import type { Workspace, WorkspaceDocument } from "./types";

type DocumentResponse = { id: string; fileName: string; filePath: string };
type WorkspaceResponse = Omit<Workspace, "selected">;

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [availableDocuments, setAvailableDocuments] = useState<WorkspaceDocument[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>();
  const [selectedSession, setSelectedSession] = useState<{ id: string; title: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightText, setHighlightText] = useState("");

  const selectedWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === selectedWorkspaceId),
    [workspaces, selectedWorkspaceId]
  );
  const selectedDocument = selectedWorkspace?.documents.find((document) => document.id === selectedDocumentId);

  useEffect(() => { void loadInitialData(); }, []);

  async function loadInitialData(preferredWorkspaceId?: string) {
    const [workspaceResponse, documentResponse] = await Promise.all([
      fetch("/api/workspace"),
      fetch("/api/documents"),
    ]);
    if (!workspaceResponse.ok || !documentResponse.ok) return;
    const workspaceData = await workspaceResponse.json() as WorkspaceResponse[];
    const documentData = await documentResponse.json() as DocumentResponse[];
    const activeId = workspaceData.some((workspace) => workspace.id === preferredWorkspaceId)
      ? preferredWorkspaceId
      : workspaceData.some((workspace) => workspace.id === selectedWorkspaceId)
        ? selectedWorkspaceId
        : workspaceData[0]?.id;
    const nextWorkspaces = workspaceData.map((workspace) => ({ ...workspace, selected: workspace.id === activeId }));
    const active = nextWorkspaces.find((workspace) => workspace.id === activeId);
    setWorkspaces(nextWorkspaces);
    setAvailableDocuments(documentData.map((document) => ({
      id: document.id, title: document.fileName, pages: 0, fileUrl: document.filePath,
    })));
    setSelectedWorkspaceId(activeId);
    setSelectedDocumentId((previous) => active?.documents.some((document) => document.id === previous)
      ? previous
      : active?.documents[0]?.id);
  }

  function resetViewer(documentId?: string) {
    setSelectedDocumentId(documentId);
    setCurrentPage(1);
    setHighlightText("");
  }

  function selectWorkspace(workspaceId: string) {
    const workspace = workspaces.find((item) => item.id === workspaceId);
    setSelectedWorkspaceId(workspaceId);
    setWorkspaces((items) => items.map((item) => ({ ...item, selected: item.id === workspaceId })));
    setSelectedSession(undefined);
    resetViewer(workspace?.documents[0]?.id);
  }

  async function createWorkspace() {
    const title = window.prompt("Workspace name", `Workspace ${workspaces.length + 1}`)?.trim();
    if (!title) return;
    const response = await fetch("/api/workspace", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }),
    });
    if (response.ok) await loadInitialData((await response.json() as WorkspaceResponse).id);
  }

  async function renameWorkspace(workspaceId: string) {
    const workspace = workspaces.find((item) => item.id === workspaceId);
    const title = window.prompt("Workspace name", workspace?.title)?.trim();
    if (!title || title === workspace?.title) return;
    const response = await fetch(`/api/workspace/${workspaceId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }),
    });
    if (response.ok) await loadInitialData(workspaceId);
  }

  async function deleteWorkspace(workspaceId: string) {
    if (!window.confirm("Delete this workspace and its chat history?")) return;
    const response = await fetch(`/api/workspace/${workspaceId}`, { method: "DELETE" });
    if (response.ok) await loadInitialData(workspaceId === selectedWorkspaceId ? undefined : selectedWorkspaceId);
  }

  async function addDocument(document: WorkspaceDocument) {
    if (!selectedWorkspaceId) return;
    const response = await fetch(`/api/workspace/${selectedWorkspaceId}/document`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ documentId: document.id }),
    });
    if (response.ok) {
      await loadInitialData(selectedWorkspaceId);
      resetViewer(document.id);
    }
  }

  async function removeDocument(documentId: string) {
    if (!selectedWorkspaceId) return;
    const response = await fetch(`/api/workspace/${selectedWorkspaceId}/document/${documentId}`, { method: "DELETE" });
    if (response.ok) {
      await loadInitialData(selectedWorkspaceId);
      if (selectedDocumentId === documentId) resetViewer();
    }
  }

  return (
    <main className="h-screen bg-slate-950 p-2 text-white">
      <div className="grid h-full min-h-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl xl:grid-cols-[220px_220px_minmax(320px,1fr)_280px_minmax(380px,1.2fr)]">
        <WorkspaceSidebar workspaces={workspaces} onSelect={selectWorkspace} onRemove={deleteWorkspace} onAdd={() => { void createWorkspace(); }} onRename={(id) => { void renameWorkspace(id); }} />
        <section className="min-h-0 border-r border-slate-700 bg-slate-950">
          {selectedWorkspaceId ? <WorkspaceChatSidebar workspaceId={selectedWorkspaceId} selectedSessionId={selectedSession?.id} onSelect={(session) => setSelectedSession(session)} /> : <EmptyPanel message="Select a workspace to see chats." />}
        </section>
        <section className="flex min-h-0 flex-col border-r border-slate-700 bg-slate-900">
          <header className="border-b border-slate-700 p-4"><h1 className="text-lg font-semibold">AI Assistant</h1><p className="mt-1 text-xs text-slate-400">Searches every document in this workspace.</p></header>
          <div className="min-h-0 flex-1">
            {selectedWorkspaceId && selectedSession ? <WorkspaceChatPanel workspaceId={selectedWorkspaceId} sessionId={selectedSession.id} onTitleChange={(title) => setSelectedSession((current) => current ? { ...current, title } : current)} onSourceSelect={(source) => { resetViewer(source.documentId); setCurrentPage(source.pageNumber); setHighlightText(source.content); }} /> : <EmptyPanel message="Create a new chat to begin." />}
          </div>
        </section>
        <WorkspaceDocuments workspace={selectedWorkspace} selectedDocumentId={selectedDocumentId} availableDocuments={availableDocuments} onAddDocument={(document) => { void addDocument(document); }} onRemoveDocument={(id) => { void removeDocument(id); }} onSelectDocument={resetViewer} />
        <section className="min-h-0 overflow-hidden bg-white">{selectedDocument ? <PdfViewer fileUrl={selectedDocument.fileUrl} pageNumber={currentPage} highlightText={highlightText} /> : <EmptyPanel message="Select a document to preview its PDF." light />}</section>
      </div>
    </main>
  );
}

function EmptyPanel({ message, light = false }: { message: string; light?: boolean }) {
  return <div className={`flex h-full flex-col items-center justify-center p-6 text-center ${light ? "bg-slate-100" : ""}`}>{light ? <FileText className="mb-3 text-slate-400" size={40} /> : <FolderOpen className="mb-3 text-slate-600" size={40} />}<p className={light ? "text-sm text-slate-500" : "text-sm text-slate-400"}>{message}</p></div>;
}
