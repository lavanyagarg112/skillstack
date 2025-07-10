"use client";

import { useAuth } from "@/context/AuthContext";
import HistoryComponent from "@/components/history/HistoryComponent";
export default function HistoryPage() {
  const { user } = useAuth();

  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-purple-600">
        Activity History
      </h1>
      <p className="mb-4 text-gray-600">
        View your recent activity and changes made in the system.
      </p>
      <HistoryComponent />
    </div>
  );
}
