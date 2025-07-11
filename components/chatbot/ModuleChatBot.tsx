"use client";

import { useEffect, useState } from "react";

interface ModuleChatbotProps {
  courseId: string;
  moduleId: string;
  isEnrolled: boolean;
}

type ChatMessage = { type: "user" | "assistant"; content: string };

export default function ModuleChatbot({
  courseId,
  moduleId,
  isEnrolled,
}: ModuleChatbotProps) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);

  if (!isEnrolled) {
    return null;
  }

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/chatbot/logs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, moduleId }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          const logMessages: ChatMessage[] = [];
          data.logs
            .reverse()
            .forEach((log: { question: string; answer: string }) => {
              logMessages.push({ type: "user", content: log.question });
              logMessages.push({ type: "assistant", content: log.answer });
            });
          setChat(logMessages);
        }
      } catch {
        // Ignore load errors
      }
    };
    fetchLogs();
  }, [courseId, moduleId]);

  const sendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setError(null);
    setLoading(true);

    setChat((prev) => [...prev, { type: "user", content: question }]);

    try {
      const res = await fetch("/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId, moduleId, question }),
      });
      const data = await res.json();

      if (data.success && data.answer) {
        setChat((prev) => [
          ...prev,
          { type: "assistant", content: data.answer },
        ]);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Failed to get response. Please try again.");
    }
    setLoading(false);
    setQuestion("");
  };

  const clearHistory = async () => {
    if (!confirm("Clear all chat history for this module?")) return;
    setClearError(null);
    setClearing(true);
    try {
      const res = await fetch("/api/chatbot/module-log", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });
      if (!res.ok) throw new Error("Failed to clear history");
      setChat([]);
    } catch (err: any) {
      setClearError(err.message || "Could not clear history.");
    }
    setClearing(false);
  };

  return (
    <div className="bg-gray-50 border rounded-xl p-5 shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Module Assistant</h3>
        <button
          onClick={clearHistory}
          disabled={clearing}
          className="text-sm text-red-600 hover:underline disabled:opacity-50"
        >
          {clearing ? "Clearing..." : "Clear History"}
        </button>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        Note: Bot does not have access to course materials.
      </div>
      <div className="min-h-[120px] max-h-60 overflow-y-auto flex flex-col gap-3 mb-4">
        {chat.length === 0 && (
          <div className="text-gray-400 text-sm">
            Ask a question about this course!
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
      {clearError && (
        <div className="text-red-500 text-xs mb-2">{clearError}</div>
      )}
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
