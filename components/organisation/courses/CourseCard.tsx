"use client";

import Link from "next/link";

export interface Course {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  course: Course;
  isAdmin: boolean;
}

// todo
// get user enrollements from backed
// so from backend: user enrollments + other courses
// endpoints to:
// 1. get all courses (admin)
// 2. get user enrollments (user)
// 3. get other courses (user)
// admin is not enrolled in any course

export default function CourseCard({ course, isAdmin }: Props) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-purple-600">{course.name}</h2>
      <p className="mt-2 text-gray-700">{course.description?.slice(0, 100)}</p>

      <div className="mt-4 flex items-center space-x-4">
        <Link href={`/courses/${course.id}`}>
          <button className="text-purple-600 hover:underline">
            View Modules
          </button>
        </Link>
        {!isAdmin && (
          <button
            className="text-purple-600 hover:underline"
            onClick={() => {}}
          >
            Enroll
          </button>
        )}
        {isAdmin && (
          <Link href={`/courses/${course.id}/edit`}>
            <button className="px-3 py-1 border border-purple-600 rounded text-purple-600 hover:bg-purple-50">
              Edit
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
