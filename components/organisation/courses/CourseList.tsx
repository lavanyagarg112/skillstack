"use client";

import Link from "next/link";
import CourseCard, { Course } from "./CourseCard";

interface Props {
  courses: Course[];
  isAdmin: boolean;
}

export default function CourseList({ courses, isAdmin }: Props) {
  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="text-right">
          <Link href="/courses/new">
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded">
              + Add Course
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
