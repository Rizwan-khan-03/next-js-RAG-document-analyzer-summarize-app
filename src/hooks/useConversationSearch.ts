"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { highlightText } from "@/utils/highlightText";

interface SearchableMessage {
  text: string;
}

interface SearchMatch {
  messageIndex: number;
}

export function useConversationSearch(messages: SearchableMessage[]) {
  const [searchText, setSearchText] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo<SearchMatch[]>(() => {
    const query = searchText.trim().toLocaleLowerCase();
    if (!query) return [];

    return messages.flatMap((message, messageIndex) => {
      const occurrences = message.text.toLocaleLowerCase().split(query).length - 1;
      return Array.from({ length: occurrences }, () => ({ messageIndex }));
    });
  }, [messages, searchText]);

  const updateSearchText = useCallback((value: string) => {
    setSearchText(value);
    setCurrentMatch(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "f") {
        event.preventDefault();
        setIsOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const match = matches[currentMatch];
    document.getElementById(`chat-message-${match?.messageIndex}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentMatch, matches]);

  const next = useCallback(() => {
    if (matches.length) setCurrentMatch((current) => (current + 1) % matches.length);
  }, [matches.length]);
  const prev = useCallback(() => {
    if (matches.length) setCurrentMatch((current) => (current - 1 + matches.length) % matches.length);
  }, [matches.length]);
  const clear = useCallback(() => setSearchText(""), []);

  return {
    searchText,
    setSearchText: updateSearchText,
    matches,
    currentMatch,
    next,
    prev,
    clear,
    highlight: highlightText,
    isOpen,
    inputRef,
  };
}
