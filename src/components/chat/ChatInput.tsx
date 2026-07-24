"use client";

import { memo, type KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

function ChatInput({ value, loading, onChange, onSend }: ChatInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return <div className="flex-shrink-0 border-t border-slate-700 bg-slate-900/70 p-2 text-slate-100"><div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-800 p-2"><textarea className="min-h-[44px] max-h-[140px] flex-1 resize-none border-0 bg-transparent p-1 text-sm outline-none focus:ring-0" rows={1} value={value} placeholder="Ask anything..." onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} aria-busy={loading} /><button type="button" onClick={onSend} className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-900" aria-label="Send message">➤</button></div></div>;
}

export default memo(ChatInput);
