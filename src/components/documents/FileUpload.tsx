"use client";

import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "/api/documents/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    console.log(result);
    alert("File uploaded");
      window.location.reload();
  };
  

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}