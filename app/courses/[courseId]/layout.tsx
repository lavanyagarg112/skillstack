import { ReactNode } from "react";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";

export default async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { courseId: string };
}) {
  const user = await getAuthUser();
  const isAdmin = user?.organisation?.role === "admin";
  const { courseId } = await params;

  const response = {
    id: courseId,
    name: "Sample Course", // Replace with actual API call to fetch course details
  };
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <nav className="text-sm mb-4">
        <Link href="/courses" className="text-purple-600 hover:underline">
          Go to All Courses
        </Link>
        {/* <span className="mx-2">/</span>
        <span className="font-medium">{response.name}</span> */}
      </nav>

      {isAdmin && (
        <div className="text-right mb-6 space-x-2">
          <Link
            href={`/courses/${response.id}/edit`}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Edit Course Details
          </Link>
          <Link
            href={`/courses/${response.id}/modules/new`}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Add new module
          </Link>
        </div>
      )}

      {children}
    </div>
  );
}
