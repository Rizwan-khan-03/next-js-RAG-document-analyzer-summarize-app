"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ResponseToolbar from "./ResponseToolbar";
import type { ChatMessageData, Source } from "./types";
import { highlightText } from "@/utils/highlightText";

interface ChatMessageProps {
  message: ChatMessageData;
  index: number;
  loading: boolean;
  copied: boolean;
  searchText: string;
  onSourceSelect: (source: Source) => void;
  onCopy: () => void;
  onRegenerate: () => void;
  onFeedback: (feedback: "LIKE" | "DISLIKE") => void;
  onShare: () => void;
  onExport: (format: "md" | "txt") => void;
}

function ChatMessage({ message, index, loading, copied, searchText, onSourceSelect, onCopy, onRegenerate, onFeedback, onShare, onExport }: ChatMessageProps) {
  if (message.role === "user") return <div id={`chat-message-${index}`} className="bg-blue-600 text-white rounded-xl p-3 ml-12">{highlightText(message.text, searchText)}</div>;

  const sources = Array.from(new Map((message.sources ?? []).map((source) => [source.pageNumber, source])).values());
  return <div id={`chat-message-${index}`} className="mr-12 rounded-xl bg-gray-100 p-3 text-black"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>{sources.length ? <div className="mt-4 flex flex-wrap gap-2">{sources.map((source, sourceIndex) => <button key={`${source.pageNumber}-${sourceIndex}`} type="button" onClick={() => onSourceSelect(source)} className="rounded-lg bg-blue-100 px-3 py-2 text-sm hover:bg-blue-200">📄 Page {source.pageNumber}</button>)}</div> : null}<ResponseToolbar messageId={message.id ?? `${index}`} content={message.text} onCopy={onCopy} onRegenerate={onRegenerate} onFeedback={onFeedback} onShare={onShare} onExport={onExport} loading={loading} feedback={message.feedback ?? null} copied={copied} /></div>;
}

export default memo(ChatMessage);
