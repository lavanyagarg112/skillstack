"use client";

import { useAuth } from "@/context/AuthContext";
import ManageTags from "@/components/organisation/settings/ManageTags";

export default function OrganisationsPage() {
  const { user } = useAuth();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";

  if (!isAdmin) {
    return (
      <div>
        <h1>My Organisation</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-purple-600">
        My Organisation
      </h1>
      <ManageTags />
    </div>
  );
}
