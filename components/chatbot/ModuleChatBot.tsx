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
  const [chat, setChat] = useState<
    { type: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        // Ignore errors in loading logs
      }
    };
    fetchLogs();
  }, []);

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
      <div>Note: Bot does not have access to course materials.</div>
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
