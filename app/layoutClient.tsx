"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HeaderNav from "@/components/HeaderNav";
import SideNav from "@/components/SideNav";
import OrgNav from "@/components/organisation/OrgNav";
import OnboardingNav from "@/components/onboarding/OnboardingNav";
import Footer from "@/components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const isLoggedIn = user && user.isLoggedIn;
  const router = useRouter();
  const role = user && user.hasCompletedOnboarding && user.organisation?.role;
  const isAdmin = role === "admin";

  const shouldRedirectToOnboarding = isLoggedIn && !user.hasCompletedOnboarding;

  useEffect(() => {
    if (shouldRedirectToOnboarding) {
      router.push("/onboarding");
    }
  }, [shouldRedirectToOnboarding, router]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, router]);

  return (
    <div>
      {isLoggedIn && user.hasCompletedOnboarding && isAdmin && (
        <div className="flex">
          <OrgNav />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      )}
      {isLoggedIn && user.hasCompletedOnboarding && !isAdmin && (
        <div className="flex">
          <SideNav />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      )}
      {!isLoggedIn && (
        <div>
          <HeaderNav />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      )}
      {isLoggedIn && !user.hasCompletedOnboarding && (
        <div>
          <OnboardingNav />
          <main className="container mx-auto p-4">{children}</main>
        </div>
      )}

      <Footer />
    </div>
  );
}
