import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import CourseForm, {
  Course,
} from "@/components/organisation/courses/CourseForm";

export default async function EditCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const user = await getAuthUser();
  const { courseId } = await params;
  if (user?.organisation?.role !== "admin") {
    redirect(`/courses/${courseId}`);
  }

  // Dummy course; swap for real fetch/DB call
  const course: Course = {
    id: Number(courseId),
    name: `Course #${courseId}`,
    description: "Existing course description",
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">
        Edit Course
      </h2>
      <CourseForm mode="edit" course={course} />
    </div>
  );
}
