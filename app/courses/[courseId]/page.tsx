import ModuleList from "@/components/organisation/courses/ModuleList";
import { Module } from "@/components/organisation/courses/ModuleCard";

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  // Replace with actual api
  const modules: Module[] = [
    { id: 1, title: "Getting Started", module_type: "video", position: 1 },
    { id: 2, title: "Deep Dive", module_type: "pdf", position: 2 },
  ];

  return <ModuleList modules={modules} />;
}
