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
    completedModules: number;
    totalModules: number;
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
    <div className="bg-[#fafbff] min-h-screen py-8 px-2">
      <div className="max-w-6xl mx-auto">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-7">
            {/* WELCOME */}
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-700 mb-2 tracking-tight">
                {welcome}
              </div>
            </div>

            {/* CONTINUE SECTION */}
            <div>
              <div className="text-xl font-semibold mb-3 text-gray-900">
                Continue where you left off
              </div>
              <div className="rounded-2xl bg-white shadow p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {currentCourse && currentModule ? (
                  <>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-gray-800">
                        {currentCourse.name}
                      </div>
                      <div className="text-gray-500 text-base mb-3">
                        Module: {currentModule.title}
                      </div>
                      <Link
                        href={`/courses/${currentCourse.id}/modules/${currentModule.id}`}
                        className="inline-block bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 transition shadow"
                      >
                        Resume
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 font-medium">
                    No course in progress.
                  </div>
                )}
              </div>
            </div>

            {/* NEXT STEPS */}
            <div>
              <div className="text-xl font-semibold mb-3 text-gray-900">
                Next Steps For You
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* LEARN */}
                <div className="rounded-2xl bg-purple-50 p-4 shadow">
                  <div className="font-bold text-purple-700 mb-1">Learn</div>
                  {nextToLearn && nextToLearn.length > 0 ? (
                    nextToLearn.map((mod) => (
                      <Link
                        key={mod.id}
                        href={`/courses/${currentCourse?.id}/modules/${mod.id}`}
                        className="block bg-white px-4 py-2 rounded-lg mb-2 shadow hover:bg-purple-100 font-medium"
                      >
                        {mod.title}
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-400">All caught up!</div>
                  )}
                </div>
                {/* REVISE */}
                <div className="rounded-2xl bg-purple-50 p-4 shadow">
                  <div className="font-bold text-purple-700 mb-1">Revise</div>
                  {toRevise && toRevise.length > 0 ? (
                    toRevise.map((mod) => (
                      <Link
                        key={mod.id}
                        href={`/courses/${currentCourse?.id}/modules/${mod.id}`}
                        className="block bg-white px-4 py-2 rounded-lg mb-2 shadow hover:bg-purple-100 font-medium"
                      >
                        {mod.title}
                      </Link>
                    ))
                  ) : (
                    <div className="text-gray-400">Nothing to revise.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* AT A GLANCE */}
            <div className="rounded-2xl bg-gray-100 shadow-md p-7 flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="text-lg font-bold mb-2 text-gray-900">
                At a glance
              </div>
              <div className="text-base font-medium text-gray-800 mb-2">
                Modules Completed
              </div>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-4xl font-bold text-purple-600">
                  {summaryStats.completedModules}
                </span>
                <span className="text-2xl text-gray-400 font-bold">/</span>
                <span className="text-2xl font-bold text-purple-400">
                  {summaryStats.totalModules}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-purple-100 h-3 rounded-full">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      summaryStats.totalModules > 0
                        ? (summaryStats.completedModules /
                            summaryStats.totalModules) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
