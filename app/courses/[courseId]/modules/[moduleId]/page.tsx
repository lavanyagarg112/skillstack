// app/courses/[courseId]/modules/[moduleId]/page.tsx
import ModuleDetail from "@/components/organisation/courses/ModuleDetail";
import { getAuthUser } from "@/lib/auth";

export default async function ModulePage({
  params,
}: {
  params: { courseId: string; moduleId: string };
}) {
  const user = await getAuthUser();
  const isAdmin = user?.organisation?.role === "admin";
  const { moduleId } = await params;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <ModuleDetail moduleId={moduleId} isAdmin={isAdmin} />
    </div>
  );
}
