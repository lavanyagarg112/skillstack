"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeSignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Will add api logic here
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Terms Accepted:", termsAccepted);
    router.push("/dashboard");
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Create Your Account
      </h1>
      <form className="space-y-4" onSubmit={handleSignUp}>
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="label"
            className="mr-2 h-4 w-4 accent-purple-600"
            onClick={(e) =>
              setTermsAccepted((e.target as HTMLInputElement).checked)
            }
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          <label htmlFor="label" className="text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </Link>
            <span className="text-xs text-gray-500 block mt-1">
              You'll receive updates about your account
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-medium mt-2"
        >
          Register
        </button>
      </form>
    </>
  );
}
