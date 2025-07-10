"use client";

import { useEffect, useState } from "react";

interface ActivityLog {
  id: number;
  action: string;
  metadata: Record<string, any>;
  created_at: string;
}

export default function HistoryComponent() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/activity", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(({ logs }: { logs: ActivityLog[] }) => setLogs(logs))
      .catch((err) => {
        console.error(err);
        setError("Failed to load history.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-8">Loading history…</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;
  if (!logs.length) return <p className="text-center py-8">No history yet.</p>;

  // sort newest first
  const sorted = [...logs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <ul className="relative border-l-2 border-gray-200 dark:border-gray-700">
      {sorted.map((log) => {
        const title = log.action.replace(/_/g, " ");
        const time = new Date(log.created_at).toLocaleString();

        return (
          <li key={log.id} className="mb-8 ml-6">
            <span className="absolute flex items-center justify-center w-4 h-4 bg-purple-600 rounded-full -left-2 ring-4 ring-white dark:ring-gray-900"></span>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-purple-700 capitalize">
                {title}
              </h3>
              <time className="text-xs text-gray-400">{time}</time>
            </div>

            {Object.keys(log.metadata).length > 0 && (
              <details className="mt-1 text-sm text-gray-600">
                <summary className="cursor-pointer hover:text-purple-600">
                  View details
                </summary>
                <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </details>
            )}
          </li>
        );
      })}
    </ul>
  );
}
