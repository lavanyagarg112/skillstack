import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersList from "@/components/organisation/users/UsersList";

export default async function UsersPage() {
  const user = await getAuthUser();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }
  const isAdmin = user?.organisation?.role === "admin";
  if (!isAdmin) {
    redirect("/dashboard");
    return null;
  }

  const organisationId = user.organisation.id;
  return <UsersList organisationId={organisationId} />;
}
