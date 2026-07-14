"use client";

import { useState, useRef, useEffect } from "react";
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
    const viewerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!highlightText) return;

        const timer = setTimeout(() => {
            const textLayer = viewerRef.current?.querySelector(
                ".react-pdf__Page__textContent"
            );

            if (!textLayer) return;

            // remove previous highlights
            textLayer.querySelectorAll("span").forEach((span) => {
                span.style.background = "";
                span.style.color = "";
            });

            const words = highlightText
                .split(/\s+/)
                .filter((w) => w.length > 4)
                .slice(0, 15);

            textLayer.querySelectorAll("span").forEach((span) => {
                const text = span.textContent?.toLowerCase() || "";

                const matched = words.some((word) =>
                    text.includes(word.toLowerCase())
                );

                if (matched) {
                    span.style.background = "#fde047";
                        span.style.color = "black";
                    span.style.borderRadius = "2px";
                }
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [pageNumber, highlightText]);
    return (
        <div
            ref={viewerRef}
            className="w-full h-full overflow-auto border rounded-lg p-2 bg-white"
        >
            <Document
                file={fileUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
                <Page
                    pageNumber={pageNumber}
                    width={700}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                />
                {/* <Page
                    pageNumber={pageNumber}
                    width={700}
                    customTextRenderer={({ str }) => {
                        if (!highlightText) return str;

                        const words = highlightText
                            .toLowerCase()
                            .split(/\s+/)
                            .filter((w) => w.length > 3);

                        const match = words.some((word) =>
                            str.toLowerCase().includes(word)
                        );

                        if (match) {
                            return `
      <mark style="
        background:#fde047;
        border-radius:3px;
        padding:2px;
      ">
        ${str}
      </mark>
    `;
                        }

                        return str;
                    }}
                /> */}
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