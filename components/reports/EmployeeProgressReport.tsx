"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface CourseDone {
  id: number;
  name: string;
  completed_at: string;
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

export default function EmployeeProgressReport() {
  const { userId } = useParams() as { userId: string };
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/reports/employee/${userId}/progress`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json: ProgressData) => {
        setData(json);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load employee progress.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading employee progress…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold mb-4">Employee Progress</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Courses Completed</h2>
        {data.coursesDone.length ? (
          <ul className="list-disc list-inside">
            {data.coursesDone.map((c) => (
              <li key={c.id}>
                {c.name} — {new Date(c.completed_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses completed yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Modules Completed</h2>
        <p className="text-lg">{data.modulesDone}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Quiz Results</h2>
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

      <section>
        <h2 className="text-2xl font-semibold mb-2">Strengths</h2>
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

      <section>
        <h2 className="text-2xl font-semibold mb-2">Areas to Improve</h2>
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
