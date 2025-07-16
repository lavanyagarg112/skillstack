"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (
      pathname === "/" ||
      pathname === "/auth" ||
      pathname === "/terms" ||
      pathname === "/privacy"
    )
      return;
    if (!user.isLoggedIn) {
      router.replace("/auth");
      return;
    }
    if (!user.hasCompletedOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [loading, pathname, user, router]);

  return <>{children}</>;
}
