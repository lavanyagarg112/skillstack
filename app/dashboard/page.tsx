import { getAuthUser } from "@/lib/auth";
import UserDashboard from "@/components/dashboard/UserDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";
  if (isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">Dashboard</h1>
        <AdminDashboard />
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-purple-600">Dashboard</h1>
      <UserDashboard />
    </div>
  );
}
