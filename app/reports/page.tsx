"use client";

import BasicReport from "@/components/reports/BasicReport";
import { useAuth } from "@/context/AuthContext";
import AdminBasicReport from "@/components/reports/AdminBasicReport";

export default function ReportsPage() {
  const { user } = useAuth();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";

  if (isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-600 ">Reports</h1>
        <AdminBasicReport />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-purple-600 ">Reports</h1>
      <BasicReport />
    </div>
  );
}
