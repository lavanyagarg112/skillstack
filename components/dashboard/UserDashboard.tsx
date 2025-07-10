"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Course {
  id: number;
  name: string;
}

interface Module {
  id: number;
  title: string;
}

interface DashboardData {
  welcome: string;
  currentCourse: Course | null;
  currentModule: Module | null;
  nextToLearn: Module[];
  toRevise: Module[];
  summaryStats: {
    completed: number;
    total: number;
  };
}

export default function UserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/user-dashboard", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        const json = await res.json();
        setData(json);
      })
      .catch((err) => setError(err.message || "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="text-red-600 text-center py-10">
        {error || "No data."}
      </div>
    );
  }

  const {
    welcome,
    currentCourse,
    currentModule,
    nextToLearn,
    toRevise,
    summaryStats,
  } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-semibold text-purple-700">{welcome}</h1>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Continue where you left off
          </h2>
          {currentCourse && currentModule ? (
            <div className="bg-purple-200 p-6 rounded-xl shadow">
              <div className="font-bold text-lg mb-1">{currentCourse.name}</div>
              <div className="text-gray-700 mb-4">
                Module: {currentModule.title}
              </div>
              <Link
                href={`/courses/${currentCourse.id}/modules/${currentModule.id}`}
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Resume
              </Link>
            </div>
          ) : (
            <div className="text-gray-500">No course in progress.</div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Next Steps For You</h2>
          <div className="mb-2">
            <div className="font-medium">Learn</div>
            {nextToLearn && nextToLearn.length > 0 ? (
              nextToLearn.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/courses/${currentCourse?.id}/modules/${mod.id}`}
                  className="block bg-purple-200 py-2 px-4 rounded mb-2 hover:bg-purple-300 transition"
                >
                  {mod.title}
                </Link>
              ))
            ) : (
              <div className="text-gray-500">All caught up!</div>
            )}
          </div>
          <div>
            <div className="font-medium">Revise</div>
            {toRevise && toRevise.length > 0 ? (
              toRevise.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/courses/${currentCourse?.id}/modules/${mod.id}`}
                  className="block bg-purple-100 py-2 px-4 rounded mb-2 hover:bg-purple-200 transition"
                >
                  {mod.title}
                </Link>
              ))
            ) : (
              <div className="text-gray-500">Nothing to revise.</div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-gray-100 p-8 rounded-xl shadow flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">At a glance</h2>
          <div className="text-lg font-medium mb-1">Modules Completed</div>
          <div className="text-3xl font-bold text-purple-700 mb-2">
            {summaryStats.completed}{" "}
            <span className="text-gray-500">/ {summaryStats.total}</span>
          </div>
          <div className="w-full bg-purple-100 h-3 rounded-full">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  summaryStats.total > 0
                    ? (summaryStats.completed / summaryStats.total) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
