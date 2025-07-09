"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ManageTags from "@/components/organisation/settings/ManageTags";
import OnboardingConfig from "@/components/organisation/settings/OnboardingConfig";

export default function OrganisationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"tags" | "onboarding">("tags");

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
      <h1 className="text-3xl font-bold mb-6 text-purple-600">
        My Organisation
      </h1>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("tags")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tags"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Tags
            </button>
            <button
              onClick={() => setActiveTab("onboarding")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "onboarding"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Onboarding Form
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "tags" && <ManageTags />}
      {activeTab === "onboarding" && <OnboardingConfig />}
    </div>
  );
}
