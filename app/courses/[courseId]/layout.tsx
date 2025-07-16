import { ReactNode } from "react";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import CourseBreadcrumb from "@/components/navigation/CourseBreadCrumb";

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

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <CourseBreadcrumb courseId={courseId} />

      {isAdmin && (
        <div className="text-right mb-6 space-x-2">
          <Link
            href={`/courses/${courseId}/edit`}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Edit Course Details
          </Link>
          <Link
            href={`/courses/${courseId}/modules/new`}
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
