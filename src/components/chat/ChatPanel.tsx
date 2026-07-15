"use client";

import { useState } from "react";
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
  onSourceSelect: (source: Source) => void;
}

export default function ChatPanel({
  documentId,
  onSourceSelect,
}: ChatPanelProps) {
  console.log("ChatPanel props", {
    documentId,
    onSourceSelect,
    type: typeof onSourceSelect,
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim()) return;

    const userQuestion = question;

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
        question: userQuestion,
        history: messages,
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

      setMessages((prev) => {
        const copy = [...prev];

        copy[copy.length - 1] = {
          role: "assistant",
          text: answer,
          sources,
        };

        return copy;
      });
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">

        {messages.map((message, index) => (
          <div key={index}>

            {message.role === "user" ? (
              <div className="bg-blue-600 text-white rounded-xl p-3 ml-12">
                {message.text}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-3 mr-12">

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
          <div className="bg-gray-100 rounded-xl p-3 mr-12">
            Thinking...
          </div>
        )}

      </div>

      <div className="border-t pt-4">
        <textarea
          className="w-full border rounded-lg p-3 resize-none"
          rows={3}
          value={question}
          placeholder="Ask anything..."
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={askAI}
          className="w-full mt-3 bg-black text-white rounded-lg py-3"
        >
          Send
        </button>
      </div>

    </div>
  );
}