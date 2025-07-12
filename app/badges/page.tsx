import { getAuthUser } from "@/lib/auth";
import AdminBadgesPage from "@/components/badges/AdminBadge";
import UserBadgesPage from "@/components/badges/UserBadge";

export default async function BadgesPage() {
  const user = await getAuthUser();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";

  if (isAdmin) {
    return null;
  }

  return <UserBadgesPage />;
}
