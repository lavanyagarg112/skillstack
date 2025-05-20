"use client";

import { useState } from "react";
import EmployeeSignUpForm from "@/components/employee/signup/page";
import EmployeeLoginForm from "@/components/employee/login/page";
import OrganizationSignUpForm from "@/components/organization/signup/page";
import OrganizationLoginForm from "@/components/organization/login/page";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("signup");
  const [accountType, setAccountType] = useState("employee");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md shadow-lg rounded-lg p-8 border border-gray-100">
          {/* Account Type Tabs */}
          <div className="flex mb-8 justify-center border-b">
            <button
              className={`px-6 py-3 transition-colors ${
                accountType === "employee"
                  ? "border-b-2 border-purple-600 text-purple-800 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setAccountType("employee")}
            >
              Employee
            </button>
            <button
              className={`px-6 py-3 transition-colors ${
                accountType === "organization"
                  ? "border-b-2 border-purple-600 text-purple-800 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setAccountType("organization")}
            >
              Organization
            </button>
          </div>

          {/* Login/Signup Toggle */}
          <div className="flex mb-8 justify-center bg-gray-100 rounded-full p-1">
            <button
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === "signup"
                  ? "bg-white text-purple-800 font-medium shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === "login"
                  ? "bg-white text-purple-800 font-medium shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
          </div>

          {/* Forms */}
          <div className="mt-6">
            {/* Employee Sign Up Form */}
            {activeTab === "signup" && accountType === "employee" && (
              <EmployeeSignUpForm />
            )}

            {/* Employee Login Form */}
            {activeTab === "login" && accountType === "employee" && (
              <EmployeeLoginForm />
            )}

            {/* Organization Sign Up Form */}
            {activeTab === "signup" && accountType === "organization" && (
              <OrganizationSignUpForm />
            )}

            {/* Organization Login Form */}
            {activeTab === "login" && accountType === "organization" && (
              <OrganizationLoginForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
