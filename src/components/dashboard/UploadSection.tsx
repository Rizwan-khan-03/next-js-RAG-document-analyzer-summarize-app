"use client";


import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import FileUpload from "./FileUpload";

export default function UploadSection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-8"
        >
            <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-indigo-500/10 p-4">
                    <UploadCloud
                        size={30}
                        className="text-indigo-400"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Upload Documents
                    </h2>

                    <p className="mt-1 text-slate-400">
                        Upload PDF files to summarize, search and chat with AI.
                    </p>
                </div>
                <FileUpload />
            </div>

        </motion.div>
    );
}