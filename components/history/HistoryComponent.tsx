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
      .then((json: { logs: ActivityLog[] }) => {
        setLogs(json.logs);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load history.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading history…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!logs.length) return <p>No history available yet.</p>;

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg text-purple-700">
                {log.action.replace(/_/g, " ")}
              </h3>
              {Object.keys(log.metadata).length > 0 && (
                <pre className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {new Date(log.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
