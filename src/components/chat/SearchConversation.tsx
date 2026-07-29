"use client";

import type { RefObject } from "react";

interface SearchConversationProps {
  isOpen: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  total: number;
  current: number;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClear: () => void;
}

export default function SearchConversation({
  isOpen, inputRef, value, total, current, onChange, onNext, onPrev, onClear,
}: SearchConversationProps) {
  if (!isOpen) return null;

  return (
    <div className="flex items-center gap-2 border-b p-3">
      <input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search conversation..." className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500" />
      {value ? <><span className="text-xs text-gray-500">{total === 0 ? "0" : `${current + 1}/${total}`}</span><button type="button" onClick={onPrev}>↑</button><button type="button" onClick={onNext}>↓</button><button type="button" onClick={onClear}>✕</button></> : null}
    </div>
  );
}
