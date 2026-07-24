"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import DocumentActions from "./DocumentActions";
import SearchConversation from "./SearchConversation";
import { useConversationSearch } from "@/hooks/useConversationSearch";
import type { ChatMessageData, Source } from "./types";

interface ChatPanelProps {
  documentId: string;
  sessionId?: string;
  activeTitle?: string;
  onTitleChange?: (title: string) => void;
  onSourceSelect: (source: Source) => void;
}

export default function ChatPanel({ documentId, sessionId, onTitleChange, onSourceSelect }: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const activeSessionIdRef = useRef<string | undefined>(sessionId);
  const search = useConversationSearch(messages);

  useEffect(() => {
    activeSessionIdRef.current = sessionId;
    setMessages([]);
    void loadMessages(sessionId);
  }, [sessionId]);

  async function streamAssistantReply({ currentSessionId, questionText, history, replaceAssistantIndex, replaceAssistantMessageId }: { currentSessionId: string; questionText: string; history: ChatMessageData[]; replaceAssistantIndex?: number; replaceAssistantMessageId?: string }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, sessionId: currentSessionId, question: questionText, history, replaceAssistantMessageId }),
    });
    if (!response.body) {
      setLoading(false);
      return;
    }

    setMessages((previous) => {
      const next = [...previous];
      const assistant = { role: "assistant" as const, text: "", sources: [] };
      if (typeof replaceAssistantIndex === "number") next[replaceAssistantIndex] = { ...next[replaceAssistantIndex], ...assistant };
      else next.push(assistant);
      return next;
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const marker = "__SOURCES__";
      const markerIndex = buffer.indexOf(marker);
      const answer = markerIndex === -1 ? buffer : buffer.substring(0, markerIndex);
      let sources: Source[] = [];
      if (markerIndex !== -1) {
        try { sources = JSON.parse(buffer.substring(markerIndex + marker.length).trim()); }
        catch { /* Keep streaming until the source payload is complete. */ }
      }
      if (activeSessionIdRef.current !== currentSessionId) break;

      setMessages((previous) => {
        const next = [...previous];
        const targetIndex = typeof replaceAssistantIndex === "number" ? replaceAssistantIndex : next.length - 1;
        if (next[targetIndex]) next[targetIndex] = { ...next[targetIndex], role: "assistant", text: answer, sources };
        return next;
      });
    }
    setLoading(false);
    if (activeSessionIdRef.current === currentSessionId) await loadMessages(currentSessionId);
  }

  async function sendMessage(promptOverride?: string) {
    const userQuestion = (promptOverride ?? question).trim();
    if (!userQuestion || !sessionId) return;

    const history = [...messages, { role: "user" as const, text: userQuestion }];
    onTitleChange?.(userQuestion.length > 40 ? `${userQuestion.slice(0, 40)}...` : userQuestion);
    setMessages(history);
    setQuestion("");
    setLoading(true);
    await streamAssistantReply({ currentSessionId: sessionId, questionText: userQuestion, history });
  }

  async function loadMessages(targetSessionId = sessionId) {
    if (!targetSessionId) {
      setMessages([]);
      return;
    }
    const response = await fetch(`/api/chat/message?sessionId=${targetSessionId}`);
    if (activeSessionIdRef.current !== targetSessionId) return;
    const data = await response.json();
    setMessages(data.map((message: { id?: string; role: string; content: string; sources?: Source[]; feedback?: "LIKE" | "DISLIKE" | null }) => ({
      id: message.id,
      role: message.role as ChatMessageData["role"],
      text: message.content,
      sources: message.sources ?? [],
      feedback: message.feedback ?? null,
    })));
  }

  async function handleRegenerate(messageIndex: number) {
    const target = messages[messageIndex];
    const previousUserMessage = messages.slice(0, messageIndex).reverse().find((message) => message.role === "user");
    if (!sessionId || target?.role !== "assistant" || !previousUserMessage) return;
    setLoading(true);
    await streamAssistantReply({ currentSessionId: sessionId, questionText: previousUserMessage.text, history: messages.slice(0, messageIndex), replaceAssistantIndex: messageIndex, replaceAssistantMessageId: target.id });
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  }

  async function handleCopy(content: string, messageId?: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId ?? null);
      showToast("Copied to clipboard");
    } catch {
      showToast("Unable to copy");
    }
  }

  async function handleFeedback(messageId: string | undefined, feedback: "LIKE" | "DISLIKE") {
    if (!messageId) return;
    const currentMessage = messages.find((message) => message.id === messageId);
    try {
      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, feedback: currentMessage?.feedback === feedback ? null : feedback }),
      });
      if (!response.ok) return;
      const updatedMessage = await response.json();
      setMessages((previous) => previous.map((message) => message.id === updatedMessage.id ? { ...message, feedback: updatedMessage.feedback ?? null } : message));
    } catch { /* Preserve the existing silent feedback-error behavior. */ }
  }

  async function handleShare(content: string) {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "AI response", text: content });
        return;
      } catch { /* Fall back to the clipboard. */ }
    }
    await handleCopy(content);
    showToast("Copied share text");
  }

  function handleExport(content: string, format: "md" | "txt") {
    const blob = new Blob([content], { type: format === "md" ? "text/markdown" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `response-${new Date().toISOString().slice(0, 10)}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-white">
      <SearchConversation isOpen={search.isOpen} inputRef={search.inputRef} value={search.searchText} total={search.matches.length} current={search.currentMatch} onChange={search.setSearchText} onNext={search.next} onPrev={search.prev} onClear={search.clear} />
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        {messages.length === 0 && !loading ? <div className="p-5"><DocumentActions onAction={(prompt) => void sendMessage(prompt)} /></div> : null}
        <ChatMessages messages={messages} loading={loading} copiedMessageId={copiedMessageId} searchText={search.searchText} onSourceSelect={onSourceSelect} onCopy={(message) => void handleCopy(message.text, message.id)} onRegenerate={(index) => void handleRegenerate(index)} onFeedback={(messageId, feedback) => void handleFeedback(messageId, feedback)} onShare={(content) => void handleShare(content)} onExport={handleExport} />
      </div>
      {toast ? <div className="border-b border-slate-700 bg-slate-800/90 px-4 py-2 text-sm text-slate-100">{toast}</div> : null}
      <ChatInput value={question} loading={loading} onChange={setQuestion} onSend={() => void sendMessage()} />
    </div>
  );
}
