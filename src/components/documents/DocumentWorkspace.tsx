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
  console.log("Selected Session:", selectedSessionId);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 w-full h-[calc(100vh-2rem)] overflow-hidden bg-slate-800 text-white gap-4 p-4">

      {/* 1. First Container: DocumentSidebar (20% Width) */}
      <div className="md:col-span-2 border rounded-xl h-full min-h-0 overflow-hidden">
        <DocumentSidebar document={document} />
      </div>

      {/* 2. Second Container: ChatSidebar (10% Width) */}
      <div className="md:col-span-1 border rounded-xl h-full min-h-0 overflow-hidden">
        <ChatSidebar
          documentId={document.id}
          selectedSessionId={selectedSessionId}
          onSelect={(id) => {
            console.log("DocumentWorkspace received:", id);
            setSelectedSessionId(id);
          }}
        />
      </div>

      {/* 3. Third Container: Chat Panel (20% Width) */}
      <div className="md:col-span-3 flex flex-col rounded-xl border shadow-sm h-full min-h-0 overflow-hidden">
        <h2 className="flex-shrink-0 font-semibold text-xl p-5 border-b">
          🤖 AI Assistant
        </h2>
        <div className="flex-1 min-h-0">
          <ChatPanel
            documentId={document.id}
            sessionId={selectedSessionId}
            onSourceSelect={(source) => {
              setCurrentPage(source.pageNumber);
              setHighlightText(source.content);
            }}
          />
        </div>
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