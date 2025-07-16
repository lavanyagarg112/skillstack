"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  totalCourses: number;
  completedCourses: number;
}

interface Enrollment {
  courseName: string;
  enrolledCount: number;
}

interface AdminDashboardData {
  welcome: string;
  organisationName: string;
  employees: Employee[];
  enrollments: Enrollment[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/admin-dashboard", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        const json = await res.json();
        const enrollments = (json.enrollments || []).map((e: any) => ({
          courseName: e.coursename,
          enrolledCount: Number(e.enrolledcount),
        }));
        const employees = (json.employees || []).map((emp: any) => ({
          id: emp.id,
          firstname: emp.firstname,
          lastname: emp.lastname,
          totalCourses: Number(emp.totalCourses),
          completedCourses: Number(emp.completedCourses),
        }));
        setData({ ...json, employees, enrollments });
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
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  // Calculate quick stats
  const totalEmployees = data.employees.length;
  const totalCourses = data.enrollments.length;
  const totalEnrollments = data.enrollments.reduce(
    (a, e) => a + e.enrolledCount,
    0
  );
  const totalCompleted = data.employees.reduce(
    (a, e) => a + e.completedCourses,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{data.welcome}</h1>
      <div className="text-lg text-gray-600 mb-4">{data.organisationName}</div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStat label="Employees" value={totalEmployees} />
        <DashboardStat label="Courses" value={totalCourses} />
        <DashboardStat label="Enrollments" value={totalEnrollments} />
        <DashboardStat label="Courses Completed" value={totalCompleted} />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Course Enrollments</h2>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data.enrollments}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="courseName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="enrolledCount"
                fill="#a21caf"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Employee Course Progress</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Enrolled</th>
                <th className="py-2 font-medium">Completed</th>
              </tr>
            </thead>
            <tbody>
              {data.employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    {emp.firstname} {emp.lastname}
                  </td>
                  <td className="py-2">{emp.totalCourses}</td>
                  <td className="py-2">{emp.completedCourses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-purple-50 rounded-xl p-5 text-center shadow border">
      <div className="text-2xl font-bold text-purple-700">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}
