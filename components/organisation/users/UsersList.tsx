"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const sortedUsers = [...users].sort((a, b) =>
    a.role === "admin" && b.role !== "admin"
      ? -1
      : b.role === "admin" && a.role !== "admin"
      ? 1
      : 0
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`/api/users`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function loadInvite() {
      try {
        const res = await fetch("/api/orgs/get-curent-invitecode", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load invite code");
        const { inviteCode } = await res.json();
        setInviteCode(inviteCode);
      } catch (e: any) {
        setInviteError(e.message);
      } finally {
        setInviteLoading(false);
      }
    }
    loadInvite();
  }, []);

  if (loading) {
    return <p className="text-center py-6">Loading users…</p>;
  }
  if (error) {
    return <p className="text-center py-6 text-red-500">Error: {error}</p>;
  }

  const handleGenerate = async () => {
    setInviteLoading(true);
    try {
      const res = await fetch("/api/orgs/generate-invite-code", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate invite code");
      const { inviteCode } = await res.json();
      setInviteCode(inviteCode);
      setInviteError(null);
    } catch (e: any) {
      setInviteError(e.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to remove this user from your organisation? All enrolments and data will be deleted permanently." +
          "\n\nThis action cannot be undone."
      )
    )
      return;
    try {
      const res = await fetch(`/api/users`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to remove user");
      setUsers(users.filter((u) => u.id !== userId));
      alert("User removed successfully");
    } catch (err: any) {
      setError(err.message || "Failed to remove user");
      console.error("Error removing user:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Users in Your Organisation</h1>

      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">Invitation Code</h2>
        {inviteLoading ? (
          <p>Loading…</p>
        ) : inviteError ? (
          <p className="text-red-500">{inviteError}</p>
        ) : (
          <div className="flex items-center space-x-2">
            <code className="font-mono bg-white px-2 py-1 rounded">
              {inviteCode || "No invite code generated yet"}
            </code>
            <button
              onClick={handleGenerate}
              className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
            >
              Generate New
            </button>
            <button
              onClick={() =>
                inviteCode && navigator.clipboard.writeText(inviteCode)
              }
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {sortedUsers.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u, idx) => (
                <tr
                  key={u.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 text-sm">
                    {u.firstname} {u.lastname}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">{u.email}</td>
                  <td className="px-4 py-2 text-sm text-purple-600 font-medium">
                    {u.role}
                  </td>
                  {u.role !== "admin" && (
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => handleRemoveUser(u.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
