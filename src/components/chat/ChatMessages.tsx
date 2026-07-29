"use client";

import { memo, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessageData, Source } from "./types";

interface ChatMessagesProps {
  messages: ChatMessageData[];
  loading: boolean;
  copiedMessageId: string | null;
  searchText: string;
  onSourceSelect: (source: Source) => void;
  onCopy: (message: ChatMessageData) => void;
  onRegenerate: (index: number) => void;
  onFeedback: (messageId: string | undefined, feedback: "LIKE" | "DISLIKE") => void;
  onShare: (content: string) => void;
  onExport: (content: string, format: "md" | "txt") => void;
}

function ChatMessages({ messages, loading, copiedMessageId, searchText, onSourceSelect, onCopy, onRegenerate, onFeedback, onShare, onExport }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  return <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">{messages.map((message, index) => <ChatMessage key={message.id ?? index} message={message} index={index} loading={loading} copied={copiedMessageId === message.id} searchText={searchText} onSourceSelect={onSourceSelect} onCopy={() => onCopy(message)} onRegenerate={() => onRegenerate(index)} onFeedback={(feedback) => onFeedback(message.id, feedback)} onShare={() => onShare(message.text)} onExport={(format) => onExport(message.text, format)} />)}{loading ? <div className="bg-gray-100 text-black rounded-xl p-3 mr-12">Thinking...</div> : null}</div>;
}

export default memo(ChatMessages);
