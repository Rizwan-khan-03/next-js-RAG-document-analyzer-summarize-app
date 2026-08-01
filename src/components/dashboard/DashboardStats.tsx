"use client";

import {
  FileText,
  BrainCircuit,
  FolderOpen,
  MessageSquare,
} from "lucide-react";

const stats = [
  {
    title: "Documents",
    value: "12",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "AI Summaries",
    value: "10",
    icon: BrainCircuit,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Workspaces",
    value: "4",
    icon: FolderOpen,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "AI Chats",
    value: "38",
    icon: MessageSquare,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-2 pl-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon size={26} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}