import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import LogoutButton from "@/components/auth/logout/LogoutButton";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/auth");
  }

  return (
    <div>
      <h1>Welcome, {user.firstname || user.email}</h1>
      <p>Organisation: {user.organisationName}</p>
      <LogoutButton />
    </div>
  );
}
