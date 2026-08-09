"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import CustomTextLayer from "./CustomTextLayer";
// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
const url = "https://rxjmskbwoscbmfjqyznz.supabase.co/storage/v1/object/sign/documents/1786246344136-Resume%20(1).pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yYTJlZmM4NS0xZDk1LTRkZWItOGI3NS0wNjNiZTc2NDRhN2IiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2N1bWVudHMvMTc4NjI0NjM0NDEzNi1SZXN1bWUgKDEpLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODYyNDg3MDcsImV4cCI6MTc4Njg1MzUwN30.uJU34lF2KzyQQNsL-KGJY0Ak6pGhjoO5kYhvExU39i8"
interface PdfViewerProps {
    filePath: string;
    pageNumber: number;
    highlightText?: string;
    documentId: string;
}

export default function PdfViewer({
    documentId,
    pageNumber,
    highlightText,
}: PdfViewerProps) {
    const [numPages, setNumPages] = useState(0);
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const viewerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let cancelled = false;

        async function loadPdfUrl() {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/documents/${documentId}/url`
                );

                if (!response.ok) {
                    throw new Error("Failed to get PDF URL");
                }

                const data = await response.json();

                if (!cancelled) {
                    setPdfUrl(data.url);
                }
            } catch (error) {
                console.error("PDF URL ERROR:", error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadPdfUrl();

        return () => {
            cancelled = true;
        };
    }, [documentId]);
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
            className="w-full h-full min-h-0 overflow-auto"
        >
            {
                loading && (
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="text-gray-400">Loading PDF...</div>
                    </div>
                )
            }
            <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
                <Page
                    pageNumber={pageNumber}
                    width={570}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                />

            </Document>

            <div className="mt-1 text-center text-sm text-gray-500">
                Page {pageNumber} of {numPages}
            </div>
            {/* {highlightText && (
                <div className="mt-4 rounded-lg border bg-yellow-50 p-3">
                    <h4 className="font-semibold mb-2">
                        🎯 Matched Chunk
                    </h4>

                    <p className="text-sm whitespace-pre-wrap">
                        {highlightText}
                    </p>
                </div>
            )} */}
            {highlightText && (
                <div className="mt-4 rounded-lg border bg-yellow-50 p-3">
                    <h4 className="font-semibold mb-2">
                        🎯 Matched Chunk
                    </h4>

                    <div className="text-sm whitespace-pre-wrap leading-6">
                        <CustomTextLayer
                            text={highlightText}
                            highlight={highlightText}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}