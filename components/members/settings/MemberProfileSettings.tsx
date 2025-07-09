"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface UserProfileData {
  id: string | number;
  firstname: string;
  lastname: string;
  email: string;
}

export default function MemberProfileSettings() {
  const { user, setUser } = useAuth();
  const [initialData, setInitialData] = useState<UserProfileData | null>(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userData = {
        id: user.userId || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      };
      setInitialData(userData);
      if (user.firstname) {
        setFirstname(user.firstname);
      }
      if (user.lastname) {
        setLastname(user.lastname);
      }
      if (user.email) {
        setEmail(user.email);
      }
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (
      initialData &&
      initialData.firstname === firstname &&
      initialData.lastname === lastname &&
      initialData.email === email
    ) {
      setMessage("No changes made");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await res.json();

      // Update the auth context with new user data
      if (updatedUser.user) {
        setUser(updatedUser.user);
      }

      setInitialData({ id: user?.userId || "", firstname, lastname, email });
      setError(null);
      setMessage("Profile updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      setMessage(null);
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFirstname(initialData.firstname);
      setLastname(initialData.lastname);
      setEmail(initialData.email);
      setError(null);
      setMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-purple-700">
        Profile Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={firstname}
            maxLength={100}
            required
            onChange={(e) => setFirstname(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={lastname}
            maxLength={100}
            required
            onChange={(e) => setLastname(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            maxLength={255}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}
        {message && (
          <div className="text-green-600 text-sm mb-4 text-center">
            {message}
          </div>
        )}

        {/* Save / Cancel */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
