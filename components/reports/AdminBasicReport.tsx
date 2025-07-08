// components/reports/AdminBasicReport.tsx
"use client";

import { useState, useEffect } from "react";

interface CourseSummary {
  id: number;
  name: string;
  total_enrolled: number;
  total_completed: number;
  videos: number;
  quizzes: number;
  pdfs: number;
  slides: number;
  others: number;
}

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

interface EmployeeProgress {
  id: number;
  firstname: string;
  lastname: string;

  coursesDone: CourseDone[];
  modulesDone: number;
  quizResults: QuizResult[];
  strengths: TagPerf[];
  weaknesses: TagPerf[];
}

interface OverviewData {
  courses: CourseSummary[];
  employees: {
    total: number;
    list: EmployeeProgress[];
  };
}

export default function AdminBasicReport() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reports/overview", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json: OverviewData) => setData(json))
      .catch((err) => {
        console.error(err);
        setError("Failed to load overview report.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading overview…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return null;

  return (
    <div className="space-y-12 p-6">
      <h1 className="text-3xl font-bold">Admin Overview</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Courses Summary</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Course</th>
              <th className="border px-2 py-1">Enrolled</th>
              <th className="border px-2 py-1">Completed</th>
              <th className="border px-2 py-1">Videos</th>
              <th className="border px-2 py-1">Quizzes</th>
              <th className="border px-2 py-1">PDFs</th>
              <th className="border px-2 py-1">Slides</th>
              <th className="border px-2 py-1">Others</th>
            </tr>
          </thead>
          <tbody>
            {data.courses.map((c) => (
              <tr key={c.id}>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.total_enrolled}</td>
                <td className="border px-2 py-1">{c.total_completed}</td>
                <td className="border px-2 py-1">{c.videos}</td>
                <td className="border px-2 py-1">{c.quizzes}</td>
                <td className="border px-2 py-1">{c.pdfs}</td>
                <td className="border px-2 py-1">{c.slides}</td>
                <td className="border px-2 py-1">{c.others}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Employees Progress ({data.employees.total})
        </h2>

        {data.employees.list.map((emp) => (
          <details
            key={emp.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <summary className="text-lg font-medium cursor-pointer">
              {emp.firstname} {emp.lastname}
            </summary>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold">Courses Completed</h3>
                {emp.coursesDone.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {emp.coursesDone.map((c) => (
                      <li key={c.id}>
                        {c.name} —{" "}
                        {new Date(c.completed_at).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4">None yet</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Modules Completed</h3>
                <p className="ml-4">{emp.modulesDone}</p>
              </div>

              <div>
                <h3 className="font-semibold">Quiz Results</h3>
                {emp.quizResults.length ? (
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1 text-left">Quiz</th>
                        <th className="border px-2 py-1">Score</th>
                        <th className="border px-2 py-1">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emp.quizResults.map((q) => (
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
                  <p className="ml-4">No quizzes taken</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Strengths</h3>
                {emp.strengths.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {emp.strengths.map((t) => (
                      <li key={t.tag_name}>
                        {t.tag_name}: {t.correct}/{t.total} ({t.pct}%)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4">None identified</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Areas to Improve</h3>
                {emp.weaknesses.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {emp.weaknesses.map((t) => (
                      <li key={t.tag_name}>
                        {t.tag_name}: {t.correct}/{t.total} ({t.pct}%)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4">None identified</p>
                )}
              </div>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
