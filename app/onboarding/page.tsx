"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [orgName, setOrgName] = useState("");
  const [orgId, setOrgId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (role === "admin") {
        // 1) Create the org + link you as admin
        const create = await fetch("/api/orgs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organisationName: orgName }),
        });
        if (!create.ok) {
          const body = await create.json().catch(() => ({}));
          throw new Error(body.message || "Failed to create organization");
        }
      } else {
        const addemp = await fetch("/api/orgs/addemployee", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organisationId: orgId }),
        });
        if (!addemp.ok) {
          const body = await addemp.json().catch(() => ({}));
          throw new Error(body.message || "Failed to add employee");
        }
      }

      // 2) Mark onboarding complete
      const done = await fetch("/api/complete-onboarding", {
        method: "POST",
        credentials: "include",
      });
      if (!done.ok) throw new Error("Could not complete onboarding");
      const updatedUser = await fetch("/api/me", {
        credentials: "include",
      }).then((r) => r.json());
      setUser(updatedUser);
      router.push(`/dashboard`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Onboarding</h1>
      <p className="mb-6 text-gray-600">
        Welcome, {user.firstname || user.email}! Let’s get you set up.
      </p>

      {/* Step 1: Choose role */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            role === "employee"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setRole("employee")}
        >
          Join Organization
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${
            role === "admin"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setRole("admin")}
        >
          Create Organization
        </button>
      </div>

      {role === "admin" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="orgName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Organization Name
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating…" : "Create & Continue"}
          </button>
        </form>
      )}
      {role === "employee" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="orgName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Organization Invite Code
            </label>
            <input
              id="orgName"
              type="text"
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Joining..." : "Join & Continue"}
          </button>
        </form>
      )}
    </div>
  );
}
