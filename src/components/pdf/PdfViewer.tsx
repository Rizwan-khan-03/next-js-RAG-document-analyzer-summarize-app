"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
    fileUrl: string;
    pageNumber: number;
    highlightText?: string;
}

export default function PdfViewer({
    fileUrl,
    pageNumber,
    highlightText,
}: PdfViewerProps) {
    const [numPages, setNumPages] = useState(0);

    return (
        <div className="w-full h-full overflow-auto border rounded-lg p-2 bg-white">
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
                <Page
                    pageNumber={pageNumber}
                    width={700}
                />
            </Document>

            <div className="mt-3 text-center text-sm text-gray-500">
                Page {pageNumber} of {numPages}
            </div>
            {highlightText && (
                <div className="mt-4 rounded-lg border bg-yellow-50 p-3">
                    <h4 className="font-semibold mb-2">
                        🎯 Matched Chunk
                    </h4>

                    <p className="text-sm whitespace-pre-wrap">
                        {highlightText}
                    </p>
                </div>
            )}
        </div>
    );
}