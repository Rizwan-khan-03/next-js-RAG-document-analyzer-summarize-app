"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DocumentActions from "./DocumentActions";
import ResponseToolbar from "./ResponseToolbar";
// import SuggestedQuestions from "./SuggestedQuestions";

interface AssistantMessage extends Message {
  id?: string;
  feedback?: "LIKE" | "DISLIKE" | null;
}

interface Source {
  pageNumber: number;
  similarity: number;
  content: string;
}

interface Message {
  id?: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
  feedback?: "LIKE" | "DISLIKE" | null;
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
  const [toast, setToast] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    activeSessionIdRef.current = sessionId;
    setMessages([]);
    void loadMessages(sessionId);
  }, [sessionId]);



  async function streamAssistantReply({
    currentSessionId,
    questionText,
    history,
    replaceAssistantIndex,
    replaceAssistantMessageId,
  }: {
    currentSessionId: string;
    questionText: string;
    history: Message[];
    replaceAssistantIndex?: number;
    replaceAssistantMessageId?: string;
  }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        sessionId: currentSessionId,
        question: questionText,
        history,
        replaceAssistantMessageId,
      }),
    });

    if (!response.body) {
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    setMessages((prev) => {
      const next = [...prev];

      if (typeof replaceAssistantIndex === "number") {
        next[replaceAssistantIndex] = {
          ...next[replaceAssistantIndex],
          role: "assistant",
          text: "",
          sources: [],
        };
      } else {
        next.push({
          role: "assistant",
          text: "",
          sources: [],
        });
      }

      return next;
    });

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

        const json = buffer.substring(index + marker.length).trim();

        try {
          sources = JSON.parse(json);
        } catch {
          // Keep streaming until the payload is fully available.
        }
      }

      if (activeSessionIdRef.current !== currentSessionId) {
        break;
      }

      setMessages((prev) => {
        const next = [...prev];

        if (next.length === 0) {
          return prev;
        }

        const targetIndex = typeof replaceAssistantIndex === "number"
          ? replaceAssistantIndex
          : next.length - 1;

        next[targetIndex] = {
          ...next[targetIndex],
          role: "assistant",
          text: answer,
          sources,
        };

        return next;
      });
    }

    setLoading(false);

    if (activeSessionIdRef.current === currentSessionId) {
      await loadMessages(currentSessionId);
    }
  }

  async function sendMessage(promptOverride?: string) {
    const nextQuestion = (promptOverride ?? question).trim();

    if (!nextQuestion || !sessionId) return;

    const userQuestion = nextQuestion;
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

    await streamAssistantReply({
      currentSessionId,
      questionText: userQuestion,
      history: [...previousMessages, { role: "user", text: userQuestion }],
    });
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

    const formatted = data.map((msg: { id?: string; role: string; content: string; sources?: Source[]; feedback?: "LIKE" | "DISLIKE" | null }) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      text: msg.content,
      sources: msg.sources ?? [],
      feedback: msg.feedback ?? null,
    }));

    setMessages(formatted);
  }

  async function handleCopy(content: string, messageId: string | undefined) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId ?? null);
      setToast("Copied to clipboard");
      window.setTimeout(() => setToast(null), 2000);
    } catch {
      setToast("Unable to copy");
      window.setTimeout(() => setToast(null), 2000);
    }
  }

  async function handleRegenerate(messageIndex: number) {
    if (!sessionId || !messages[messageIndex]) {
      return;
    }

    const targetMessage = messages[messageIndex];

    if (targetMessage.role !== "assistant") {
      return;
    }

    const previousUserMessage = [...messages]
      .slice(0, messageIndex)
      .reverse()
      .find((msg) => msg.role === "user");

    if (!previousUserMessage) {
      return;
    }

    const previousMessages = messages.slice(0, messageIndex);
    const questionText = previousUserMessage.text;
    const replaceAssistantMessageId = messages[messageIndex]?.id;

    setLoading(true);
    await streamAssistantReply({
      currentSessionId: sessionId,
      questionText,
      history: previousMessages,
      replaceAssistantIndex: messageIndex,
      replaceAssistantMessageId,
    });
  }

  async function handleFeedback(messageId: string | undefined, feedback: "LIKE" | "DISLIKE") {
    if (!messageId) {
      return;
    }

    const currentMessage = messages.find((message) => message.id === messageId);
    const nextFeedback = currentMessage?.feedback === feedback ? null : feedback;

    try {
      const response = await fetch("/api/chat/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          feedback: nextFeedback,
        }),
      });

      if (!response.ok) {
        return;
      }

      const updatedMessage = await response.json();

      setMessages((prev) => prev.map((message) => (message.id === updatedMessage.id ? { ...message, feedback: updatedMessage.feedback ?? null } : message)));
    } catch {
      // Ignore feedback errors.
    }
  }

  async function handleShare(content: string) {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "AI response",
          text: content,
        });
        return;
      } catch {
        // Fall back to clipboard.
      }
    }

    await handleCopy(content, undefined);
    setToast("Copied share text");
    window.setTimeout(() => setToast(null), 2000);
  }

  async function handleExport(content: string, format: "md" | "txt") {
    const date = new Date().toISOString().slice(0, 10);
    const extension = format === "md" ? "md" : "txt";
    const blob = new Blob([content], { type: format === "md" ? "text/markdown" : "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `response-${date}.${extension}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-transparent text-white">
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && !loading ? (
          <div className="space-y-4">

            <DocumentActions
              onAction={(prompt) => {
                void sendMessage(prompt);
              }}
            />
          </div>
        ) : null}



        {messages.map((message, index) => (
          <div key={index}>

            {message.role === "user" ? (
              <div className="bg-blue-600 text-white rounded-xl p-3 ml-12">
                {message.text}
              </div>
            ) : (
              <div className="mr-12 rounded-xl bg-gray-100 p-3 text-black">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  // className="prose prose-sm max-w-none"
                >
                  {message.text}
                </ReactMarkdown>

                {message.sources &&
                  message.sources.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {Array.from(
                        new Map(
                          message.sources.map((source) => [source.pageNumber, source])
                        ).values()
                      ).map((source, i) => (
                        <button
                          key={`${source.pageNumber}-${i}`}
                          onClick={() => {
                            if (typeof onSourceSelect === "function") {
                              onSourceSelect(source);
                            }
                          }}
                          className="rounded-lg bg-blue-100 px-3 py-2 text-sm hover:bg-blue-200"
                        >
                          📄 Page {source.pageNumber}
                        </button>
                      ))}
                    </div>
                  )}

                <ResponseToolbar
                  messageId={message.id ?? `${index}`}
                  content={message.text}
                  onCopy={() => {
                    void handleCopy(message.text, message.id);
                  }}
                  onRegenerate={() => {
                    void handleRegenerate(index);
                  }}
                  onFeedback={(feedback) => {
                    void handleFeedback(message.id, feedback);
                  }}
                  onShare={() => {
                    void handleShare(message.text);
                  }}
                  onExport={(format) => {
                    void handleExport(message.text, format);
                  }}
                  loading={loading}
                  feedback={message.feedback ?? null}
                  copied={copiedMessageId === message.id}
                />
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

      {toast ? (
        <div className="border-b border-slate-700 bg-slate-800/90 px-4 py-2 text-sm text-slate-100">
          {toast}
        </div>
      ) : null}

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
            onClick={() => {
              void sendMessage();
            }}
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