"use client";

import { useState, useEffect } from "react";

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
  channel?: Channel;
  level?: Level;
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
  skill_name: string;
  correct: number;
  total: number;
  pct: number;
}

interface UserBadge {
  id: number;
  name: string;
  description: string;
  awarded_at: string;
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
  badges: UserBadge[];
}

interface OrganisationBadges {
  id: number;
  name: string;
  description: string;
  course_id: number | null;
  milestone: number | null;
  earned_count: number;
}

interface OverviewData {
  courses: CourseSummary[];
  employees: {
    total: number;
    list: EmployeeProgress[];
  };
  badges: OrganisationBadges[];
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
              <th className="border px-2 py-1">Channel</th>
              <th className="border px-2 py-1">Level</th>
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
                <td className="border px-2 py-1">
                  {c.channel ? (
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {c.channel.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="border px-2 py-1">
                  {c.level ? (
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {c.level.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
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

      <section>
        <h2 className="text-2xl font-semibold mb-4">All Badges</h2>
        {data.badges.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.badges.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-lg bg-yellow-50 flex flex-col"
              >
                <h3 className="font-medium">{b.name}</h3>
                {b.description && (
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-auto">
                  Earned by {b.earned_count}{" "}
                  {b.earned_count === 1 ? "employee" : "employees"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No badges defined yet.</p>
        )}
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
                  <div className="ml-4 space-y-2">
                    {emp.coursesDone.map((c) => (
                      <div key={c.id} className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{c.name}</span>
                          <span className="text-sm text-gray-600">
                            {new Date(c.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                        {(c.channel || c.level) && (
                          <div className="mt-1 flex flex-wrap gap-1">
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
                      <li key={t.skill_name}>
                        {t.skill_name}: {t.correct}/{t.total} ({t.pct}%)
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
                      <li key={t.skill_name}>
                        {t.skill_name}: {t.correct}/{t.total} ({t.pct}%)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4">None identified</p>
                )}
              </div>{" "}
              <div>
                <h3 className="font-semibold mb-4">Badges Earned</h3>
                {emp.badges.length ? (
                  <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {emp.badges.map((b) => (
                      <div
                        key={b.id}
                        className="p-2 border rounded bg-yellow-50"
                      >
                        <p className="font-medium">{b.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(b.awarded_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="ml-4">None yet</p>
                )}
              </div>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
