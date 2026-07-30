"use client";

import Link from "next/link";

type Document = {
  id: string;
  fileName: string;
  status: string;
  createdAt: string;
};

interface Props {
  documents: Document[];
}

export default function DocumentTable({ documents }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-6 py-4">Document</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">AI</th>
            <th className="px-6 py-4">Uploaded</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>

                  <div>
                    <p className="font-medium text-gray-900">
                      {doc.fileName}
                    </p>

                    <p className="text-xs text-gray-500">
                      PDF Document
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                {doc.status === "PROCESSED" ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    PROCESSED
                  </span>
                ) : doc.status === "PROCESSING" ? (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    Processing
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    Failed
                  </span>
                )}
              </td>

              <td className="px-6 py-4">
                <span className="text-green-600 font-semibold">
                  ✓ Ready
                </span>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {new Date(doc.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-2">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/document/${doc.id}`}
                    className="flex items-center text-sm gap-1 rounded-xl bg-black px-5 py-1 font-medium text-white transition hover:bg-gray-900"
                  >
                    Open
                  </Link>

                  <button className="rounded-lg border px-3 py-2 hover:bg-gray-100">
                    ⋮
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}