import { getAuthUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user.firstname || user.email}</h1>
      <p>Organisation: {user.organisation?.organisationname}</p>
      <p>Role: {user.organisation.role}</p>
      <p>Dashboard is currently in progress.</p>
    </div>
  );
}
