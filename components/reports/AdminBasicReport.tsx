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

interface EmployeeSummary {
  id: number;
  firstname: string;
  lastname: string;
  courses_enrolled: number;
  courses_completed: number;
  modules_completed: number;
}

interface OverviewData {
  courses: CourseSummary[];
  employees: {
    total: number;
    list: EmployeeSummary[];
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
      .then((json: OverviewData) => {
        setData(json);
      })
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
    <div className="space-y-8 p-6">
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

      <section>
        <h2 className="text-2xl font-semibold mb-2">Employees Overview</h2>
        <p className="mb-4">
          Total non-admin employees: <strong>{data.employees.total}</strong>
        </p>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Employee</th>
              <th className="border px-2 py-1">Courses Enrolled</th>
              <th className="border px-2 py-1">Courses Completed</th>
              <th className="border px-2 py-1">Modules Completed</th>
            </tr>
          </thead>
          <tbody>
            {data.employees.list.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">
                  {u.firstname} {u.lastname}
                </td>
                <td className="border px-2 py-1">{u.courses_enrolled}</td>
                <td className="border px-2 py-1">{u.courses_completed}</td>
                <td className="border px-2 py-1">{u.modules_completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
