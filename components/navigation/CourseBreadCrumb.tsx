"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CourseBreadcrumb({ courseId }: { courseId: string }) {
  const pathname = usePathname();

  if (!pathname) return null;

  let linkHref = "/courses";
  let label = "Go to All Courses";

  if (pathname.includes(`/courses/${courseId}/modules/`)) {
    linkHref = `/courses/${courseId}`;
    label = "← Back to Modules";
  } else if (pathname.includes(`/courses/${courseId}`)) {
    linkHref = "/courses";
    label = "← Back to Courses";
  }

  return (
    <div className="mb-4 text-sm">
      <Link href={linkHref} className="text-purple-600 hover:underline">
        {label}
      </Link>
    </div>
  );
}
