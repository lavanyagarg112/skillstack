import { getAuthUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) {
    return null;
  }
  const organisation = user.organisation;
  const role = organisation.role;
  const isAdmin = role === "admin";
  const isMember = role === "employee";

  if (isAdmin) {
    return (
      <div>
        <h1>Organisation Courses</h1>
      </div>
    );
  }

  if (isMember) {
    return (
      <div>
        <h1>Member Settings</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Page should not reach here</h1>
    </div>
  );
}
