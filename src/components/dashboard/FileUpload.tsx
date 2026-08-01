"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    window.location.reload();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      <div className="mb-2">
        <h5 className="font-bold text-gray-900">
          Upload Documents
        </h5>

        <p className=" text-sm mt-2 text-gray-500">
          Upload PDFs to summarize, search and chat with AI.
        </p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 py-14 transition hover:border-blue-500 hover:bg-blue-100"
      >
        <div className="flex flex-col items-center">

          <UploadCloud
            size={60}
            className="text-blue-600"
          />

          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Drag & Drop PDF here
          </h3>

          <p className="mt-2 text-gray-500">
            or click to browse files
          </p>

          <p className="mt-6 text-sm text-gray-400">
            Supports PDF files only
          </p>

        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />
      </div>

      {file && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">

          <div>
            <p className="font-medium text-gray-900">
              {file.name}
            </p>

            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>

        </div>
      )}
    </div>
  );
}