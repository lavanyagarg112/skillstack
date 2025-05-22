// app/auth/page.tsx
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import AuthClient from "./AuthClient";

export default async function AuthPage() {
  const user = await getAuthUser();
  if (user) {
    redirect(`/dashboard`);
  }
  return <AuthClient />;
}
