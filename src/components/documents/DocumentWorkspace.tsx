"use client";

import { useState } from "react";
import PdfViewer from "../pdf/PdfViewer";
import ChatPanel from "../chat/ChatPanel";
import DocumentSidebar from "./DocumentSidebar";
import ChatSidebar from "../chat/ChatSidebar";
interface Props {
  document: any;
}

export default function DocumentWorkspace({
  document,
}: Props) {

  const [currentPage, setCurrentPage] =
    useState(1);

  const [highlightText, setHighlightText] =
    useState("");
  const [selectedSessionId, setSelectedSessionId] =
    useState<string>();
  const [selectedSessionTitle, setSelectedSessionTitle] =
    useState("New Chat");
  


  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 w-full h-[calc(100vh-2rem)] overflow-hidden bg-slate-800 text-white ">
      {/* 2. Combined chat container */}
      <div className="md:col-span-6 flex h-full min-h-0 overflow-hidden  border border-slate-700 bg-slate-900/90 shadow-sm">
        <div className="grid w-full min-w-0 grid-cols-[200px_minmax(0,1fr)]">
          <div className="min-h-0 border-r border-slate-700 bg-slate-900/80">
            <ChatSidebar
              documentId={document.id}
              selectedSessionId={selectedSessionId}
              onSelect={(session) => {
                setSelectedSessionId(session.id);
                setSelectedSessionTitle(session.title || "New Chat");
              }}
            />
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden">
            <h2 className="flex-shrink-0 border-b border-slate-700 p-5 text-xl font-semibold text-white">
              {"🤖 AI Assistant"}
            </h2>
            <div className="flex-1 min-h-0">
              <ChatPanel
                documentId={document.id}
                sessionId={selectedSessionId}
                activeTitle={selectedSessionTitle}
                onTitleChange={(title) => setSelectedSessionTitle(title)}
                onSourceSelect={(source) => {
                  setCurrentPage(source.pageNumber);
                  setHighlightText(source.content);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* 1. First Container: DocumentSidebar (20% Width) */}
      <div className="md:col-span-2   h-full min-h-0 overflow-hidden">
        <DocumentSidebar document={document} />
      </div>

      {/* 4. Fourth Container: PDF Viewer (40% Width) */}
      <div className="md:col-span-4 rounded-xl border bg-white shadow-sm h-full min-h-0 overflow-hidden">
        <PdfViewer
          fileUrl={document.filePath}
          pageNumber={currentPage}
          highlightText={highlightText}
        />
      </div>

    </div>
  );
}