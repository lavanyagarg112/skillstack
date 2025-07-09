"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import ManageSkills from "@/components/organisation/settings/ManageSkills";
import ManageChannels from "@/components/organisation/settings/ManageChannels";
import ManageLevels from "@/components/organisation/settings/ManageLevels";
import OnboardingConfig from "@/components/organisation/settings/OnboardingConfig";
import OrgSettings from "@/components/organisation/settings/OrgSettings";

export default function OrganisationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "skills" | "channels" | "levels" | "onboarding" | "orgSettings"
  >("skills");

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
              onClick={() => setActiveTab("skills")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "skills"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Skills
            </button>
            <button
              onClick={() => setActiveTab("channels")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "channels"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Channels
            </button>
            <button
              onClick={() => setActiveTab("levels")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "levels"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Levels
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
            <button
              onClick={() => setActiveTab("orgSettings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orgSettings"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Organisation Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "skills" && <ManageSkills />}
      {activeTab === "channels" && <ManageChannels />}
      {activeTab === "levels" && <ManageLevels />}
      {activeTab === "onboarding" && <OnboardingConfig />}
      {activeTab === "orgSettings" && <OrgSettings />}
    </div>
  );
}
