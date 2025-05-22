"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationSignUpForm() {
  const router = useRouter();
  const [organisationName, setOrganisationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Will add api logic here
    console.log("Organisation Name:", organisationName);
    console.log("Email:", email);
    console.log("Password:", password);
    router.push(`/${organisationName}/dashboard`);
  };
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Register Organization
      </h1>
      <form className="space-y-4" onSubmit={handleSignUp}>
        <div>
          <label
            htmlFor="orgName"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Organization Name
          </label>
          <input
            type="text"
            id="orgName"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
            onChange={(e) => setOrganisationName(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Admin Email
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

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-medium mt-2"
        >
          Register Organization
        </button>
      </form>
    </>
  );
}
