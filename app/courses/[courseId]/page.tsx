import ModuleList from "@/components/organisation/courses/ModuleList";
import { getAuthUser } from "@/lib/auth";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const user = await getAuthUser();
  const isAdmin = user?.organisation?.role === "admin";
  const { courseId } = await params;

  return <ModuleList courseId={courseId} isEditMode={isAdmin} />;
}
