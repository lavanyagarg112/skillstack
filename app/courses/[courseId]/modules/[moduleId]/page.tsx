// app/courses/[courseId]/modules/[moduleId]/page.tsx
import ModuleDetail, {
  ModuleDetailData,
} from "@/components/organisation/courses/ModuleDetail";

export default async function ModulePage({
  params,
}: {
  params: { courseId: string; moduleId: string };
}) {
  const { moduleId } = await params;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <ModuleDetail moduleId={moduleId} />
    </div>
  );
}
