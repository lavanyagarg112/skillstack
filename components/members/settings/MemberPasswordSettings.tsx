"use client";
import { useState } from "react";

export default function MemberPasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setMessage("Password updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update password");
      setMessage(null);
      console.error("Error updating password:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setMessage(null);
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-purple-700">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            required
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            required
            minLength={8}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
            placeholder="Enter your new password"
          />
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters long
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            required
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
            placeholder="Confirm your new password"
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
            {isSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
