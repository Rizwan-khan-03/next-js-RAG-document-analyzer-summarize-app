"use client";

import { useState } from "react";

interface ChatPanelProps {
  documentId: string;
}

export default function ChatPanel({
  documentId,
}: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
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
    setLoading(false);
  }

  return (
    <div className="mt-8 border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Ask AI
      </h2>

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

          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}