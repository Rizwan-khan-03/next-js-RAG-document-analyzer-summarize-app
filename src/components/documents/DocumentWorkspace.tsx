"use client";

import { useState } from "react";

import PdfViewer from "../pdf/PdfViewer";
import ChatPanel from "../chat/ChatPanel";
import DocumentSidebar from "./DocumentSidebar";

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

  return (

    <div className="grid grid-cols-[320px_420px_1fr] gap-6 h-[calc(100vh-80px)]">

      {/* Sidebar */}

      <DocumentSidebar
        document={document}
      />

      {/* Chat */}

      <div className="rounded-xl border shadow-sm p-5 flex flex-col h-full overflow-hidden">

        <h2 className="font-semibold text-xl ">
          🤖 AI Assistant
        </h2>

        <ChatPanel
          documentId={document.id}
          onSourceSelect={(source) => {
            setCurrentPage(source.pageNumber);
            setHighlightText(source.content);
          }}
        />

      </div>

      {/* PDF */}

      <div className="rounded-xl border shadow-sm p-5 overflow-hidden">

        <PdfViewer
          fileUrl={document.filePath}
          pageNumber={currentPage}
          highlightText={highlightText}
        />

      </div>

    </div>

  );
}