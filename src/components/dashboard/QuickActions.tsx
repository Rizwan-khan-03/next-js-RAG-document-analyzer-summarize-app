"use client";

import { Upload, FolderOpen, FileText } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
    {
        title: "Open Workspace",
        desc: "Chat across multiple PDFs",
        icon: FolderOpen,
    },
    {
        title: "Upload PDF",
        desc: "Add new document",
        icon: Upload,
    },
    {
        title: "Recent Documents",
        desc: "Continue reading",
        icon: FileText,
    },
];

export default function QuickActions() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {actions.map((action) => {
                const Icon = action.icon;

                return (
                    <motion.div
                        whileHover={{ y: -5 }}
                        key={action.title}
                        className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-500"
                    >
                        <Icon className="mb-4 text-indigo-400" size={30} />

                        <h3 className="font-semibold text-white">
                            {action.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            {action.desc}
                        </p>

                    </motion.div>
                );
            })}
        </div>
    );
}