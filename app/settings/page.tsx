import { getAuthUser } from "@/lib/auth";
import SettingsComponent from "@/components/organisation/settings/SettingsComponent";

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
        <SettingsComponent />
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
