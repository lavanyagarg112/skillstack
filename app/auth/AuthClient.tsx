"use client";
import { useState } from "react";
import LoginForm from "@/components/auth/login/LoginForm";
import SignUpForm from "@/components/auth/signup/SignupForm";

export default function AuthClient() {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md shadow-lg rounded-lg p-8 border border-gray-100">
        <div className="flex mb-8 justify-center border-b">
          <button
            className={`px-6 py-3 ${
              activeTab === "signup"
                ? "border-b-2 border-purple-600 text-purple-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
          <button
            className={`px-6 py-3 ${
              activeTab === "login"
                ? "border-b-2 border-purple-600 text-purple-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </div>

        {activeTab === "signup" ? <SignUpForm /> : <LoginForm />}
      </div>
    </div>
  );
}
