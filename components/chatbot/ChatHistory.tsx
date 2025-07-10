"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

function groupLogsByModule(logs: ChatLog[]) {
  const grouped: Record<
    string,
    {
      course_id: number;
      module_id: number;
      course: string;
      module: string;
      logs: ChatLog[];
    }
  > = {};
  for (const log of logs) {
    const key = `${log.course_id}:${log.module_id}`;
    if (!grouped[key]) {
      grouped[key] = {
        course_id: log.course_id,
        module_id: log.module_id,
        course: log.name,
        module: log.title,
        logs: [],
      };
    }
    grouped[key].logs.push(log);
  }
  return Object.values(grouped);
}

export default function ChatHistoryPage() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/chatbot/history", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
          if (data.logs.length > 0) {
            const mostRecent = data.logs[0];
            setOpenPanels({
              [`${mostRecent.course_id}:${mostRecent.module_id}`]: true,
            });
          }
        }
      } catch (err) {
        // Ignore errors in loading logs
      }
    };
    fetchLogs();
  }, []);

  const grouped = groupLogsByModule(logs);

  return (
    <div className="bg-gray-50 border rounded-xl p-5 shadow">
      <h3 className="font-bold text-lg mb-4">Your Chatbot Q&A History</h3>
      {logs.length === 0 ? (
        <div className="text-gray-400 text-sm">No questions asked yet!</div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          {grouped.map((mod) => {
            const panelKey = `${mod.course_id}:${mod.module_id}`;
            const isOpen = openPanels[panelKey] || false;
            return (
              <div key={panelKey} className="border rounded bg-white">
                {/* Panel header */}
                <button
                  className={`w-full text-left flex items-center justify-between px-4 py-3 cursor-pointer select-none ${
                    isOpen ? "bg-purple-50" : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setOpenPanels((prev) => ({
                      ...prev,
                      [panelKey]: !prev[panelKey],
                    }))
                  }
                >
                  <span className="flex flex-col gap-1">
                    <span>
                      <Link
                        href={`/courses/${mod.course_id}`}
                        className="font-semibold text-purple-800 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {mod.course}
                      </Link>
                      <span className="text-gray-400 px-1">/</span>
                      <Link
                        href={`/courses/${mod.course_id}/modules/${mod.module_id}`}
                        className="italic text-blue-700 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {mod.module}
                      </Link>
                    </span>
                    <span className="text-xs text-gray-500">
                      {mod.logs.length}{" "}
                      {mod.logs.length === 1 ? "question" : "questions"}
                    </span>
                  </span>
                  <span className="text-xs text-gray-600">
                    {isOpen ? "▼" : "▶"}
                  </span>
                </button>

                {isOpen && (
                  <div className="divide-y">
                    {mod.logs.map((log, i) => (
                      <div key={log.id} className="p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
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
          })}
        </div>
      )}
    </div>
  );
}
