"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  UsersIcon,
  MapIcon,
  ClockIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import LogoutButton from "./auth/logout/LogoutButton";
import { useAuth } from "@/context/AuthContext";

const menuSections = [
  {
    heading: "General",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { label: "My Roadmap", href: "/roadmap", icon: MapIcon },
      { label: "Courses", href: "/courses", icon: BookOpenIcon },
      { label: "Reports", href: "/reports", icon: ChartBarIcon },
    ],
  },
  {
    heading: "Management",
    items: [
      { label: "History", href: "/history", icon: ClockIcon },
      //   { label: "Organisations", href: "/organisations", icon: UsersIcon },
      { label: "Settings", href: "/settings", icon: CogIcon },
    ],
  },
];

export default function SideNav() {
  const path = usePathname();
  const { user } = useAuth();
  const firstName = user.firstname || user.email;
  const lastName = user.lastname || user.email;
  const avatarUrl = `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}&background=f4d9b2&color=FF9800`;
  const [imgSrc, setImgSrc] = useState(avatarUrl);

  return (
    <aside className="sticky top-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
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

        <nav className="mt-6 px-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.heading}>
              <p className="text-xs uppercase text-gray-400 tracking-wide px-2 mb-2">
                {section.heading}
              </p>
              <ul className="space-y-1">
                {section.items.map(({ label, href, icon: Icon }) => {
                  const isActive = path === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center px-2 py-2 rounded-md transition-colors
                          ${
                            isActive
                              ? "bg-purple-100 text-purple-700"
                              : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                          }`}
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isActive ? "text-purple-600" : "text-gray-400"
                          }`}
                        />
                        <span className="ml-3 text-sm font-medium">
                          {label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="px-6 py-4 flex flex-col items-center space-y-3">
        <Image
          src={imgSrc}
          alt="Your avatar"
          width={40}
          height={40}
          className="rounded-full"
          onError={() => setImgSrc("/avatar-placeholder.jpg")}
        />
        <LogoutButton />
      </div>
    </aside>
  );
}
