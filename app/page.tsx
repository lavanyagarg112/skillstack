import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getAuthUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-bold text-purple-900 mb-4">SKILLSTACK</h1>
        <p className="text-xl text-gray-700 mb-6 text-center max-w-xl">
          From sign-up to skill-up in minutes.
        </p>
        <div className="flex space-x-4 mb-10">
          <Link
            href="/auth"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
          >
            Get Started
          </Link>
        </div>

        <div
          id="features"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Course Management</h3>
            <p className="text-center text-gray-600">
              Create, organize, and assign courses tailored to your
              organization’s needs.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Employee Learning</h3>
            <p className="text-center text-gray-600">
              Empower employees with structured learning paths and progress
              tracking.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">AI Chatbot Support</h3>
            <p className="text-center text-gray-600">
              Get instant help and guidance through our built-in AI chatbot
              assistant.
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500">
          More features coming soon!
        </p>
      </div>
    </div>
  );
}
