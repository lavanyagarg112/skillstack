// app/courses/[courseId]/modules/[moduleId]/page.tsx
import ModuleDetail, {
  ModuleDetailData,
} from "@/components/organisation/courses/ModuleDetail";

export default async function ModulePage({
  params,
}: {
  params: { courseId: string; moduleId: string };
}) {
  const { courseId, moduleId } = await params;
  // add actual data
  const data: ModuleDetailData = {
    id: Number(moduleId),
    title: `Module #${moduleId}`,
    module_type: "video",
    file_url: "/videos/sample.mp4",
    // For quizzes, add a `quiz: { title, questions }` field here
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <ModuleDetail data={data} />
    </div>
  );
}
