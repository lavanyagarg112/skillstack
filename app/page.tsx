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
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <h1 className="text-5xl font-bold text-purple-900 mb-6">SKILLSTACK</h1>
        <div className="bg-purple-200 rounded-full px-6 py-2 mb-8">
          <Link href="/auth" className="text-purple-800">
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          <div className="bg-gray-300 h-32"></div>
          <div className="bg-gray-300 h-48"></div>
        </div>
      </div>
    </div>
  );
}
