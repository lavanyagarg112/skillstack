"use client";

import { useEffect, useState } from "react";

type ChatMessage = { type: "user" | "assistant"; content: string };

export default function ChatHistoryPage() {
  const [chat, setChat] = useState<
    { type: "user" | "assistant"; content: string }[]
  >([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/chatbot/history", {
          credentials: "include",
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

  return (
    <div className="bg-gray-50 border rounded-xl p-5 shadow">
      <h3 className="font-bold text-lg mb-2">Module Assistant</h3>
      <div className="min-h-[120px] max-h-60 overflow-y-auto flex flex-col gap-3 mb-4">
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
      </div>
    </div>
  );
}
