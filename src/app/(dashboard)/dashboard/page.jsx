import Link from "next/link";

import DashboardStats from "@/components/documents/DashboardStats";
import FileUpload from "@/components/documents/FileUpload";
import DocumentList from "@/components/documents/DocumentList";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        AI Document Intelligence Platform
      </h1>

      <DashboardStats />

      <div className="mt-8">
        <FileUpload />
      </div>

      <div className="my-6 flex justify-end">
        <Link
          href="/workspace"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Open Workspace
        </Link>
      </div>

      <DocumentList />
    </div>
  );
}