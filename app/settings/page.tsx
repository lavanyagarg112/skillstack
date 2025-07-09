import { getAuthUser } from "@/lib/auth";
import OrgSettings from "@/components/organisation/settings/OrgSettings";
import MemberProfileSettings from "@/components/members/settings/MemberProfileSettings";
import MemberPasswordSettings from "@/components/members/settings/MemberPasswordSettings";
import MemberSkillsSettings from "@/components/members/settings/MemberSkillsSettings";

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }
  const organisation = user.organisation;
  const role = organisation.role;
  const isAdmin = role === "admin";
  const isMember = role === "employee";

  if (isAdmin) {
    return (
      <div>
        <OrgSettings />
      </div>
    );
  }

  if (isMember) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Member Settings
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your profile and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <MemberProfileSettings />
            </div>

            <div>
              <MemberPasswordSettings />
            </div>

            {/* <div className="lg:col-span-2">
              <MemberSkillsSettings />
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Page should not reach here</h1>
    </div>
  );
}
