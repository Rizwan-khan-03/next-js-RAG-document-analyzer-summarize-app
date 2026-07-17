"use client";

import { useEffect, useState } from "react";

interface ChatSession {
    id: string;
    title: string;
    updatedAt: string;
}

interface Props {
    documentId: string;
    selectedSessionId?: string;
    onSelect: (id: string) => void;
}

export default function ChatSidebar({
    documentId,
    selectedSessionId,
    onSelect,
}: Props) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);

    useEffect(() => {
        loadSessions();
    }, [documentId]);

    async function loadSessions() {
        const res = await fetch(
            `/api/chat/session?documentId=${documentId}`
        );

        const data = await res.json();

        setSessions(data);
    }

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden border-r  text-black">
        
            <div className="flex-1 min-h-0 overflow-y-auto p-2">
                {sessions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                        No chats yet
                    </div>
                ) : (
                    sessions.map((session) => (
                        <button
                            key={session.id}
                            onClick={() => {
                                console.log("Clicked Session:", session.id);
                                onSelect(session.id);
                            }}
                            className={`mb-2 flex w-full items-start rounded-lg border px-3 py-3 text-left text-sm transition hover:bg-gray-50 ${selectedSessionId === session.id
                                ? "border-gray-400 shadow-sm"
                                : "border-transparent"
                                }`}
                        >
                            <span className="mr-2">💬</span>
                            <span className="break-words text-white">{session.title}</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}