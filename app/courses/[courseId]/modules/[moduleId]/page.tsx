import ModuleDetail from "@/components/organisation/courses/ModuleDetail";
import ModuleChatBot from "@/components/chatbot/ModuleChatBot";
import { getAuthUser } from "@/lib/auth";

export default async function ModulePage({
  params,
}: {
  params: { courseId: string; moduleId: string };
}) {
  const user = await getAuthUser();
  const isAdmin = user?.organisation?.role === "admin";
  const { courseId, moduleId } = await params;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded">
      <ModuleDetail courseId={courseId} moduleId={moduleId} isAdmin={isAdmin} />
    </div>
  );
}
