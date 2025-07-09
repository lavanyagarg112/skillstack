"use client";

import { useEffect, useState } from "react";

interface Channel {
  id: number;
  name: string;
  description?: string;
}

interface Level {
  id: number;
  name: string;
  description?: string;
  sort_order?: number;
}

interface CourseDone {
  id: number;
  name: string;
  completed_at: string;
  channel?: Channel;
  level?: Level;
}

interface QuizResult {
  quiz_id: number;
  title: string;
  correct: number;
  total: number;
  score_pct: number;
  taken_at: string;
}

interface TagPerf {
  tag_name: string;
  correct: number;
  total: number;
  pct: number;
}

interface ProgressData {
  coursesDone: CourseDone[];
  modulesDone: number;
  quizResults: QuizResult[];
  strengths: TagPerf[];
  weaknesses: TagPerf[];
}

export default function BasicReport() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reports/progress", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json: ProgressData) => {
        setData(json);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load report.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading report…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Courses Done */}
      <section>
        <h2 className="text-2xl font-semibold ">Courses Completed</h2>
        {data.coursesDone.length ? (
          <div className="space-y-3">
            {data.coursesDone.map((c) => (
              <div key={c.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{c.name}</h3>
                  <span className="text-sm text-gray-600">
                    {new Date(c.completed_at).toLocaleDateString()}
                  </span>
                </div>
                {(c.channel || c.level) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.channel && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {c.channel.name}
                      </span>
                    )}
                    {c.level && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {c.level.name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No courses completed yet.</p>
        )}
      </section>

      {/* Modules Done */}
      <section>
        <h2 className="text-2xl font-semibold">Modules Completed</h2>
        <p className="text-lg">{data.modulesDone}</p>
      </section>

      {/* Quiz Results */}
      <section>
        <h2 className="text-2xl font-semibold">Quiz Results</h2>
        {data.quizResults.length ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-2 py-1 text-left">Quiz</th>
                <th className="border px-2 py-1">Score</th>
                <th className="border px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.quizResults.map((q) => (
                <tr key={q.quiz_id}>
                  <td className="border px-2 py-1">{q.title}</td>
                  <td className="border px-2 py-1">
                    {q.correct}/{q.total} ({q.score_pct}%)
                  </td>
                  <td className="border px-2 py-1">
                    {new Date(q.taken_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No quizzes taken yet.</p>
        )}
      </section>

      {/* Strengths */}
      <section>
        <h2 className="text-2xl font-semibold">Strengths</h2>
        {data.strengths.length ? (
          <ul className="list-disc list-inside">
            {data.strengths.map((t) => (
              <li key={t.tag_name}>
                {t.tag_name}: {t.correct}/{t.total} ({t.pct}%)
              </li>
            ))}
          </ul>
        ) : (
          <p>No clear strengths yet.</p>
        )}
      </section>

      {/* Weaknesses */}
      <section>
        <h2 className="text-2xl font-semibold">Areas to Improve</h2>
        {data.weaknesses.length ? (
          <ul className="list-disc list-inside">
            {data.weaknesses.map((t) => (
              <li key={t.tag_name}>
                {t.tag_name}: {t.correct}/{t.total} ({t.pct}%)
              </li>
            ))}
          </ul>
        ) : (
          <p>No weaknesses detected yet.</p>
        )}
      </section>
    </div>
  );
}
