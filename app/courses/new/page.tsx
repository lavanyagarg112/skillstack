// app/courses/new/page.tsx
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import CourseForm from "@/components/organisation/courses/CourseForm";

export default async function NewCoursePage() {
  const user = await getAuthUser();
  if (user?.organisation?.role !== "admin") {
    redirect("/courses");
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-purple-600 mb-4">
        Create New Course
      </h2>
      <CourseForm mode="create" />
    </div>
  );
}
