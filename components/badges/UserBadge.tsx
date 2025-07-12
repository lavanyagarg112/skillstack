"use client";

import { useState, useEffect } from "react";

interface UserBadge {
  id: number;
  name: string;
  description: string;
  awardedAt: string;
}

export default function UserBadgesPage() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch("/api/badges/user-badges", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load your badges");
        const data = (await res.json()) as { badges: UserBadge[] };
        setBadges(data.badges);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>Loading your badges…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">Your Badges</h1>
        <p className="text-gray-500">You haven’t earned any badges yet.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Your Badges</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map((b) => (
          <div
            key={b.id}
            className="p-4 border rounded-lg bg-purple-50 flex flex-col"
          >
            <h2 className="font-semibold text-lg">{b.name}</h2>
            {b.description && (
              <p className="text-gray-700 mt-1 line-clamp-2">{b.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-auto">
              Awarded on{" "}
              {new Date(b.awardedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
