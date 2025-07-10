import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import ModuleForm from "@/components/organisation/courses/ModuleForm";

export default async function NewModulePage({
  params,
}: {
  params: { courseId: string };
}) {
  const user = await getAuthUser();
  const { courseId } = params;
  if (!courseId) {
    redirect("/courses");
  }
  if (user?.organisation?.role !== "admin") {
    redirect(`/${courseId}/modules`);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">
        Create New Module
      </h2>
      <ModuleForm mode="create" courseId={courseId} />
    </div>
  );
}
