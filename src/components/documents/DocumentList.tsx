"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            .then((data) => setDocuments(data))
            .catch(console.error);
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
                Uploaded Documents
            </h2>

            {documents.length === 0 ? (
                <p>No documents uploaded yet.</p>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <Link
                            href={`/document/${doc.id}`}
                            key={doc.id}
                            className="block border rounded-lg p-4 hover:bg-gray-50"
                        >
                            <p className="font-medium">
                                {doc.fileName}
                            </p>

                            <p className="text-sm text-gray-500">
                                Status: {doc.status}
                            </p>

                            <p className="text-sm text-gray-500">
                                {new Date(
                                    doc.createdAt
                                ).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}