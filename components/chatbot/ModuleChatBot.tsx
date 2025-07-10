"use client";

import { useState } from "react";

interface ModuleChatbotProps {
  courseId: string;
  moduleId: string;
}

export default function ModuleChatbot({
  courseId,
  moduleId,
}: ModuleChatbotProps) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<
    { type: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setError(null);
    setLoading(true);

    // Add user question to chat
    setChat((prev) => [...prev, { type: "user", content: question }]);

    try {
      const res = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for cookies/session
        body: JSON.stringify({ courseId, moduleId, question }),
      });
      const data = await res.json();

      if (data?.success && data.answer) {
        setChat((prev) => [
          ...prev,
          { type: "assistant", content: data.answer },
        ]);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError("Failed to get response. Please try again.");
    }
    setLoading(false);
    setQuestion("");
  };

  return (
    <div className="bg-gray-50 border rounded-xl p-5 shadow">
      <h3 className="font-bold text-lg mb-2">Module Assistant</h3>
      <div className="min-h-[120px] max-h-60 overflow-y-auto flex flex-col gap-3 mb-4">
        {chat.length === 0 && (
          <div className="text-gray-400 text-sm">
            Ask a question about this module!
          </div>
        )}
        {chat.map((msg, i) => (
          <div
            key={i}
            className={msg.type === "user" ? "text-right" : "text-left"}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-green-50 text-green-900"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-xs">Assistant is typing…</div>
        )}
      </div>
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
      <form onSubmit={sendQuestion} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
          placeholder="Type your question…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading || !question.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
