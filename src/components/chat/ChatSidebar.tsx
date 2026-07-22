"use client";

import { useEffect, useRef, useState } from "react";

interface ChatSession {
    id: string;
    title: string;
    updatedAt: string;
}

interface Props {
    documentId: string;
    selectedSessionId?: string;
    onSelect: (session: { id: string; title: string }) => void;
}

export default function ChatSidebar({
    documentId,
    selectedSessionId,
    onSelect,
}: Props) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const autoSelectedRef = useRef(false);

    useEffect(() => {
        autoSelectedRef.current = false;
        loadSessions();
    }, [documentId]);

    useEffect(() => {
        if (autoSelectedRef.current || selectedSessionId || sessions.length === 0) {
            return;
        }

        autoSelectedRef.current = true;
        onSelect({ id: sessions[0].id, title: sessions[0].title });
    }, [sessions, selectedSessionId, onSelect]);

    async function loadSessions() {
        const res = await fetch(
            `/api/chat/session?documentId=${documentId}`
        );

        const data = await res.json();
        setSessions(data);
        return data;
    }
    async function createNewChat() {
        const res = await fetch("/api/chat/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                documentId,
            }),
        });

        const session = await res.json();
        autoSelectedRef.current = true;
        await loadSessions();
        onSelect({ id: session.id, title: session.title || "New Chat" });
    }

    async function deleteChat(sessionId: string) {
        const res = await fetch(`/api/chat/session?sessionId=${sessionId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            return;
        }

        const remainingSessions = sessions.filter((session) => session.id !== sessionId);
        setSessions(remainingSessions);

        if (selectedSessionId === sessionId) {
            const nextSession = remainingSessions[0];
            onSelect(nextSession ? { id: nextSession.id, title: nextSession.title } : { id: "", title: "New Chat" });
        }
    }

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-slate-100">
            <div className="border-b border-slate-700 p-3">
                <button
                    onClick={createNewChat}
                    className="w-full rounded-lg bg-white py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                >
                    + New Chat
                </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-2">
                {sessions.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-700 px-3 py-4 text-sm text-slate-400">
                        No chats yet
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`mb-2 flex w-full items-center rounded-lg border px-2 py-2 text-left text-sm transition ${selectedSessionId === session.id
                                ? "border-slate-600 bg-slate-800 shadow-sm"
                                : "border-transparent bg-transparent hover:bg-slate-800/70"
                                }`}
                        >
                            <button
                                onClick={() => {
                                    onSelect({ id: session.id, title: session.title });
                                }}
                                className="flex flex-1 items-start text-left text-xs text-slate-100 transition hover:text-white focus:outline-none"
                            >
                                <span className="mr-2">💬</span>
                                <span className="break-words text-slate-100">{session.title}</span>
                            </button>

                            <button
                                onClick={() => deleteChat(session.id)}
                                className="ml-2 rounded-md p-1 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                                aria-label={`Delete ${session.title}`}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}