"use client";

import { useState } from "react";

interface Source {
  pageNumber: number;
  similarity: number;
}

interface ChatPanelProps {
  documentId: string;
  onPageSelect: (page: number) => void;
}

export default function ChatPanel({
  documentId,
  onPageSelect,
}: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!question.trim()) return;

    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId,
        question,
      }),
    });

    const data = await response.json();

    setAnswer(data.answer);
    setSources(data.sources ?? []);
    setLoading(false);
  }

  return (
    <div className="mt-4">
      <textarea
        className="w-full border rounded p-3"
        rows={4}
        value={question}
        placeholder="Ask anything about this document..."
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={askAI}
        disabled={loading}
        className="mt-4 bg-black text-white px-5 py-2 rounded"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <div className="mt-6 rounded bg-gray-100 p-4">
          <h3 className="font-semibold mb-2">
            AI Response
          </h3>

          <p className="whitespace-pre-wrap">{answer}</p>

          {sources.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">
                Sources
              </h4>

              <div className="flex flex-wrap gap-2">
                {sources.map((source, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      onPageSelect(source.pageNumber)
                    }
                    className="bg-blue-100 hover:bg-blue-200 transition px-3 py-2 rounded-lg text-blue-700 text-sm font-medium"
                  >
                    📄 Page {source.pageNumber}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}