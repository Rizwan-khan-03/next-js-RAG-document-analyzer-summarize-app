import Link from "next/link";

import DashboardStats from "@/components/dashboard/DashboardStats";
import FileUpload from "@/components/dashboard/FileUpload";
import DocumentList from "@/components/dashboard/DocumentList";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-2 py-2">

        {/* Header */}

        <DashboardHeader />

        {/* Stats */}

        <DashboardStats />

        {/* Upload */}

        <div className="mt-4">
          <FileUpload />
        </div>

        {/* Documents */}

        <div className="mt-10">
          <DocumentList />
        </div>

      </div>
    </div>
  );
}