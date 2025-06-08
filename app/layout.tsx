import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import LayoutClient from "./layoutClient";
import AuthServerProvider from "./AuthClientServer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillStack",
  description: "Organization and employee skill management platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white`}>
        <AuthProvider>
          <AuthServerProvider>
            <LayoutClient>{children}</LayoutClient>
          </AuthServerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
