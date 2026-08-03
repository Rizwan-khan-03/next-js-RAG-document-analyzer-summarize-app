"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState("📤 Uploading PDF...");
  function openFilePicker() {
    inputRef.current?.click();
  }
  function handleFile(file: File | null) {
    if (!file) return;
    setFile(file);
    setMessage("");
  }

  // async function handleUpload() {
  //   if (!file) return;

  //   setUploading(true);
  //   setProgress(0);

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   const xhr = new XMLHttpRequest();

  //   xhr.upload.onprogress = (event) => {
  //     if (event.lengthComputable) {
  //       const percent = Math.round(
  //         (event.loaded / event.total) * 100
  //       );
  //       setProgress(percent);
  //     }
  //   };

  //   xhr.onload = () => {
  //     setUploading(false);

  //     if (xhr.status === 200) {
  //       setProgress(100);
  //       setMessage("✅ Upload completed successfully.");

  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 1200);
  //     } else {
  //       setMessage("❌ Upload failed.");
  //     }
  //   };

  //   xhr.onerror = () => {
  //     setUploading(false);
  //     setMessage("❌ Something went wrong.");
  //   };

  //   xhr.open("POST", "/api/documents/upload");
  //   xhr.send(formData);
  // }
  async function handleUpload() {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStage("📤 Uploading PDF...");

    const formData = new FormData();
    formData.append("file", file);

    let current = 0;

    const fakeProgress = setInterval(() => {
      current += Math.random() * 8;

      if (current >= 90) {
        current = 90;
        clearInterval(fakeProgress);
      }

      setProgress(Math.floor(current));

      // Update stage based on current progress
      if (current >= 20 && current < 40) {
        setStage("📖 Extracting Text...");
      } else if (current >= 40 && current < 60) {
        setStage("🧩 Splitting into Chunks...");
      } else if (current >= 60 && current < 80) {
        setStage("🧠 Creating Embeddings...");
      } else if (current >= 80) {
        setStage("✨ Generating AI Summary...");
      }
    }, 150);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(fakeProgress);

      if (!response.ok) throw new Error();

      setProgress(100);
      setStage("✅ Completed");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      clearInterval(fakeProgress);
      setUploading(false);
      setProgress(0);
      setStage("❌ Upload Failed");
      alert("Upload failed");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      <div
        onClick={openFilePicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-10 text-center transition hover:border-black hover:bg-gray-50"
      >
        <UploadCloud
          size={42}
          className="mx-auto mb-4 text-gray-500"
        />

        <h3 className="text-lg font-semibold text-gray-800">
          Drag & Drop PDF here
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          or click to browse
        </p>
      </div>

      {file && (
        <div className="mt-6 flex items-center justify-between rounded-xl border bg-gray-50 p-4">

          <div className="flex items-center gap-3">
            <FileText className="text-red-500" />

            <div>
              <p className="font-medium text-gray-800">
                {file.name}
              </p>

              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            disabled={uploading}
            onClick={handleUpload}
            className="rounded-lg bg-black px-6 py-2 text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </div>
      )}

      {uploading && (
        <div className="mt-6">

          <div className="mb-2 flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {stage}
          </p>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-black transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>
      )}

      {message && (
        <div className="mt-5 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
          {message}
        </div>
      )}
    </div>
  );
}