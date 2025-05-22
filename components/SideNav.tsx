import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./auth/logout/LogoutButton";

export default function SideNav() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <Link
          href="/"
          className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <Image src="/logo.svg" alt="SkillStack Logo" width={28} height={28} />
          <span className="ml-2 text-purple-800 font-semibold text-lg">
            SKILLSTACK
          </span>
        </Link>

        {/* Menu */}
        <nav className="mt-8 px-6 space-y-4">
          <Link
            href="/dashboard"
            className="block text-gray-700 hover:text-purple-600"
          >
            Dashboard
          </Link>
          <Link
            href="/courses"
            className="block text-gray-700 hover:text-purple-600"
          >
            Courses
          </Link>
          <Link
            href="/courses"
            className="block text-gray-700 hover:text-purple-600"
          >
            Reports
          </Link>
          <Link
            href="/organisations"
            className="block text-gray-700 hover:text-purple-600"
          >
            Organisations
          </Link>
          <Link
            href="/settings"
            className="block text-gray-700 hover:text-purple-600"
          >
            Settings
          </Link>
        </nav>
      </div>

      <div className="px-6 py-4 flex flex-col items-center space-y-3">
        <Image
          src="/logo.svg"
          alt="Your avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <LogoutButton />
      </div>
    </aside>
  );
}
