"use client";

import { useEffect, useState } from "react";
import DocumentTable from "./DocumentTable";

type Document = {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
};

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => res.json())
      .then(setDocuments);
  }, []);

  return (
    <div className="mt-10">
      {/* <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
           All uploaded Documents
          </h2>
        </div>
      </div> */}

      <DocumentTable documents={documents} />
    </div>
  );
}