"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Source {
  pageNumber: number;
  similarity: number;
  content: string;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
}

interface ChatPanelProps {
  documentId: string;
  sessionId?: string;
  activeTitle?: string;
  onTitleChange?: (title: string) => void;
  onSourceSelect: (source: Source) => void;
}

export default function ChatPanel({
  documentId,
  sessionId,
  activeTitle,
  onTitleChange,
  onSourceSelect,
}: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const activeSessionIdRef = useRef<string | undefined>(sessionId);

  useEffect(() => {
    activeSessionIdRef.current = sessionId;
    setMessages([]);
    void loadMessages(sessionId);
  }, [sessionId]);

 

  async function askAI() {
    if (!question.trim() || !sessionId) return;

    const userQuestion = question.trim();
    const currentSessionId = sessionId;
    const previousMessages = messages;
    const nextTitle = userQuestion.length > 40
      ? userQuestion.slice(0, 40) + "..."
      : userQuestion;

    onTitleChange?.(nextTitle);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        sessionId: currentSessionId,
        question: userQuestion,
        history: previousMessages,
      }),
    });

    if (!response.body) {
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: "",
        sources: [],
      },
    ]);

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      let answer = buffer;
      let sources: Source[] = [];

      const marker = "__SOURCES__";
      const index = buffer.indexOf(marker);

      if (index !== -1) {
        answer = buffer.substring(0, index);

        const json = buffer
          .substring(index + marker.length)
          .trim();

        try {
          sources = JSON.parse(json);
        } catch {
          // wait until JSON completes
        }
      }

      if (activeSessionIdRef.current !== currentSessionId) {
        break;
      }

      setMessages((prev) => {
        const copy = [...prev];

        if (copy.length === 0) {
          return prev;
        }

        copy[copy.length - 1] = {
          role: "assistant",
          text: answer,
          sources,
        };

        return copy;
      });
    }

    setLoading(false);

    if (activeSessionIdRef.current === currentSessionId) {
      await loadMessages(currentSessionId);
    }
  }

  async function loadMessages(targetSessionId = sessionId) {
    if (!targetSessionId) {
      setMessages([]);
      return;
    }

    const res = await fetch(
      `/api/chat/message?sessionId=${targetSessionId}`
    );

    if (activeSessionIdRef.current !== targetSessionId) {
      return;
    }

    const data = await res.json();

    const formatted = data.map((msg: any) => ({
      role: msg.role,
      text: msg.content,
      sources: msg.sources ?? [],
    }));

    setMessages(formatted);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void askAI();
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-white">

      <div className="border-b border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-medium text-slate-100">
        {activeTitle || "New Chat"}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
        {messages.map((message, index) => (
          <div key={index}>

            {message.role === "user" ? (
              <div className="bg-blue-600 text-white rounded-xl p-3 ml-12">
                {message.text}
              </div>
            ) : (
              <div className="bg-gray-100 text-black  rounded-xl p-3 mr-12">

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                // className="prose prose-sm max-w-none"
                >
                  {message.text}
                </ReactMarkdown>

                {message.sources &&
                  message.sources.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">

                      {message.sources.map(
                        (source, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              console.log("clicked", source);
                              console.log("callback", onSourceSelect);

                              if (typeof onSourceSelect === "function") {
                                onSourceSelect(source);
                              } else {
                                console.error("onSourceSelect is NOT a function");
                              }
                            }}
                            className="bg-blue-100 hover:bg-blue-200 rounded-lg px-3 py-2 text-sm"
                          >
                            📄 Page {source.pageNumber}
                          </button>
                        )
                      )}

                    </div>
                  )}

              </div>
            )}

          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 text-black rounded-xl p-3 mr-12">
            Thinking...
          </div>
        )}

      </div>

      <div className="flex-shrink-0 border-t border-slate-700 bg-slate-900/70 p-2 text-slate-100">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-800 p-2">
          <textarea
            className="min-h-[44px] max-h-[140px] flex-1 resize-none border-0 bg-transparent p-1 text-sm outline-none focus:ring-0"
            rows={1}
            value={question}
            placeholder="Ask anything..."
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={askAI}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-900"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>

    </div>
  );
}