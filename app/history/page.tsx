"use client";

import { useAuth } from "@/context/AuthContext";
import HistoryComponent from "@/components/history/HistoryComponent";
export default function HistoryPage() {
  const { user } = useAuth();

  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }
  return <HistoryComponent />;
}
