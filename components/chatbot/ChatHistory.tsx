"use client";

import { useEffect, useState } from "react";

type ChatLog = {
  id: number;
  course_id: number;
  module_id: number;
  name: string;
  title: string;
  question: string;
  answer: string;
  created_at: string;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ChatHistoryPage() {
  const [logs, setLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/chatbot/history", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } catch (err) {
        // Ignore errors in loading logs
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-gray-50 border rounded-xl p-5 shadow">
      <h3 className="font-bold text-lg mb-4">Your Chatbot Q&A History</h3>
      {logs.length === 0 ? (
        <div className="text-gray-400 text-sm">No questions asked yet!</div>
      ) : (
        <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg border p-4 bg-white">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-gray-600">
                <span className="font-semibold text-purple-700">
                  {log.name}
                </span>
                <span className="text-gray-400">•</span>
                <span className="italic">{log.title}</span>
                <span className="text-gray-400">•</span>
                <span>{formatDate(log.created_at)}</span>
              </div>
              <div className="mb-1 text-right">
                <span className="inline-block px-3 py-2 rounded-lg bg-blue-100 text-blue-900">
                  {log.question}
                </span>
              </div>
              <div className="text-left">
                <span className="inline-block px-3 py-2 rounded-lg bg-green-50 text-green-900">
                  {log.answer}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
