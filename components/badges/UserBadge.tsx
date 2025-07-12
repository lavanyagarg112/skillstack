"use client";

import { useState, useEffect } from "react";

interface UserBadge {
  id: number;
  name: string;
  description: string;
  awardedAt: string;
}

interface BadgeDefinition {
  id: number;
  name: string;
  description: string;
}

export default function UserBadgesPage() {
  const [earned, setEarned] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res1 = await fetch("/api/badges/user-badges", {
          credentials: "include",
        });
        if (!res1.ok) throw new Error("Failed to load your badges");
        const { badges } = (await res1.json()) as { badges: UserBadge[] };
        setEarned(badges);

        const res2 = await fetch("/api/badges/created-badges", {
          credentials: "include",
        });
        if (!res2.ok) throw new Error("Failed to load badge catalog");
        const data = (await res2.json()) as {
          coursesBadges: BadgeDefinition[];
          courseBadges: BadgeDefinition[];
        };
        setAllBadges([...data.coursesBadges, ...data.courseBadges]);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
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

  const earnedIds = new Set(earned.map((b) => b.id));
  const toEarn = allBadges.filter((b) => !earnedIds.has(b.id));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Your Badges</h1>

      {earned.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Badges Earned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {earned.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-lg bg-purple-50 flex flex-col"
              >
                <h2 className="font-semibold text-lg">{b.name}</h2>
                {b.description && (
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {b.description}
                  </p>
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
        </section>
      )}

      {toEarn.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badges To Earn</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {toEarn.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded-lg bg-gray-100 flex flex-col opacity-60"
              >
                <h2 className="font-semibold text-lg">{b.name}</h2>
                {b.description && (
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-auto">Locked</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {earned.length === 0 && toEarn.length === 0 && (
        <p className="text-gray-500">No badges available yet.</p>
      )}
    </div>
  );
}
