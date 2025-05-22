"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user } = useAuth();

  if (!user || !user.isLoggedIn) {
    return (
      <header className="bg-purple-100 p-4 shadow-sm">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="SkillStack Logo"
              width={28}
              height={28}
            />
            <span className="ml-2 text-purple-800 font-semibold text-lg">
              SKILLSTACK
            </span>
          </Link>
        </div>
      </header>
    );
  }

  return null;
}
