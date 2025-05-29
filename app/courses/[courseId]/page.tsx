import ModuleList from "@/components/organisation/courses/ModuleList";
import { Module } from "@/components/organisation/courses/ModuleCard";
import { getAuthUser } from "@/lib/auth";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const user = await getAuthUser();
  const isAdmin = user?.organisation?.role === "admin";
  // Replace with actual api
  const modules: Module[] = [
    { id: 1, title: "Getting Started", module_type: "video", position: 1 },
    { id: 2, title: "Deep Dive", module_type: "pdf", position: 2 },
  ];

  return <ModuleList modules={modules} isEditMode={isAdmin} />;
}
