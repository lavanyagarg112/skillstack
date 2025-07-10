"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OnboardingQuestionnaire from "@/components/onboarding/OnboardingQuestionnaire";

type OnboardingStep = "organization" | "questionnaire" | "complete";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  if (!user || !user.isLoggedIn) {
    return null;
  }

  const [step, setStep] = useState<OnboardingStep>("organization");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [orgName, setOrgName] = useState("");
  const [orgInvite, setOrgInvite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkUserOrganization = async () => {
      try {
        const response = await fetch("/api/me", { credentials: "include" });
        if (response.ok) {
          const userData = await response.json();
          if (userData.organisation) {
            if (userData.organisation.role === "admin") {
              completeOnboarding();
            } else {
              setStep("questionnaire");
            }
          }
        }
      } catch (err) {
        console.error("Error checking user organization:", err);
      } finally {
        setInitializing(false);
      }
    };

    checkUserOrganization();
  }, []);

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (role === "admin") {
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
        completeOnboarding();
      } else {
        const addemp = await fetch("/api/orgs/addemployee", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inviteCode: orgInvite,
          }),
        });
        if (!addemp.ok) {
          const body = await addemp.json().catch(() => ({}));
          throw new Error(body.message || "Failed to add employee");
        }
        setStep("questionnaire");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleQuestionnaireComplete = async (responses: number[]) => {
    setError(null);
    setLoading(true);

    try {
      if (responses.length > 0) {
        const responseSubmit = await fetch("/api/onboarding/responses", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ option_ids: responses }),
        });
        if (!responseSubmit.ok) {
          const body = await responseSubmit.json().catch(() => ({}));
          throw new Error(body.message || "Failed to submit responses");
        }
      }
      completeOnboarding();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
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
  if (initializing) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (step === "organization") {
    return (
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Onboarding</h1>
        <p className="mb-6 text-gray-600">
          Welcome, {user.firstname || user.email}! Let's get you set up.
        </p>

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
          <form onSubmit={handleOrganizationSubmit} className="space-y-4">
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
          <form onSubmit={handleOrganizationSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="orgInvite"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Organization Invite Code
              </label>
              <input
                id="orgInvite"
                type="text"
                value={orgInvite}
                onChange={(e) => setOrgInvite(e.target.value)}
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

  if (step === "questionnaire") {
    return (
      <div>
        {error && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          </div>
        )}
        <OnboardingQuestionnaire
          onComplete={handleQuestionnaireComplete}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p>Completing onboarding...</p>
      </div>
    </div>
  );
}
