"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Login failed");
      }
      const user = await fetch("/api/me", { credentials: "include" }).then(
        (r) => r.json()
      );
      setUser(user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      {error && (
        <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="text-center mt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </>
  );
}
