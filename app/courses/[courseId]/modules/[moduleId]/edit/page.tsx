import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import ModuleForm from "@/components/organisation/courses/ModuleForm";

export default async function EditModulePage({
  params,
}: {
  params: { courseId: string; moduleId: string };
}) {
  const user = await getAuthUser();
  const { courseId, moduleId } = await params;
  if (!courseId || !moduleId) {
    redirect("/courses");
  }
  if (user?.organisation?.role !== "admin") {
    redirect(`/${courseId}/modules`);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">
        Edit Module
      </h2>
      <ModuleForm mode="edit" courseId={courseId} moduleId={moduleId} />
    </div>
  );
}
