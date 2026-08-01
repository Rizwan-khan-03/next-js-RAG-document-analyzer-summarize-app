import Link from "next/link";
import { FolderOpen } from "lucide-react";

export default function DashboardHeader() {
    return (
       <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3 pl-8 shadow-sm">

            <div >

                <h3 className="text-2xl font-bold text-gray-900">
                    AI Document Intelligence
                </h3>

                <p className="mt-2 text-slate-400">
                    Upload, organize and chat with your documents.
                </p>

            </div>

            <div>
                <Link
                    href="/workspace"
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-900"
                >
                    <FolderOpen size={18} />
                    Workspace
                </Link>
            </div>

        </div>
    );
}