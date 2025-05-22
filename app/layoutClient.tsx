"use client";

import { useAuth } from "@/context/AuthContext";
import HeaderNav from "@/components/HeaderNav";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const isLoggedIn = user && user.isLoggedIn;

  return (
    <div>
      {isLoggedIn && (
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

      <Footer />
    </div>
  );
}
