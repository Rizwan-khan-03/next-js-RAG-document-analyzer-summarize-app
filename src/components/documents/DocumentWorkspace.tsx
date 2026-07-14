"use client";

import { useState } from "react";
import PdfViewer from "@/components/pdf/PdfViewer";
import ChatPanel from "@/components/chat/ChatPanel";

interface Props {
    documentId: string;
    fileUrl: string;
}

export default function DocumentWorkspace({
    documentId,
    fileUrl,
}: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [highlightText, setHighlightText] = useState("");

    return (
        <div className="grid grid-cols-2 gap-6 h-[900px]">
            {/* PDF */}
            <div className="bg-white rounded-lg shadow border p-4 overflow-hidden">
                <PdfViewer
                    fileUrl={fileUrl}
                    pageNumber={currentPage}
                    highlightText={highlightText}
                />
            </div>

            {/* Chat */}
            <div className="bg-white rounded-lg shadow border p-6">
                <h2 className="text-xl font-semibold mb-4">
                    🤖 Ask AI
                </h2>

                <ChatPanel
                    documentId={documentId}
                    onSourceSelect={(source) => {
                        setCurrentPage(source.pageNumber);
                        setHighlightText(source.content);
                    }}
                />
            </div>
        </div>
    );
}