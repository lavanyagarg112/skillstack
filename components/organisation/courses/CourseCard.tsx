"use client";

import Link from "next/link";

export interface Course {
  id: number;
  name: string;
  description?: string;
  total_modules?: number;
  completed_modules?: number;
}

interface Props {
  course: Course;
  isAdmin: boolean;
  isEnrolled: boolean;
}

export default function CourseCard({ course, isAdmin, isEnrolled }: Props) {
  const handleEnroll = async () => {
    try {
      const response = await fetch("/api/courses/enroll-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course.id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to enroll in course");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleUnEnroll = async () => {
    try {
      const response = await fetch("/api/courses/unenroll-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: course.id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to unenroll from course");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-purple-600">{course.name}</h2>
      <p className="mt-2 text-gray-700">{course.description?.slice(0, 100)}</p>

      {!isAdmin && isEnrolled && (
        <p className="mt-3 text-sm text-gray-600">
          Progress:{" "}
          <span className="font-medium text-gray-800">
            {course.completed_modules ?? 0}
          </span>
          /
          <span className="font-medium text-gray-800">
            {course.total_modules ?? 0}
          </span>{" "}
          modules completed.
        </p>
      )}

      <div className="mt-4 flex items-center space-x-4">
        <Link href={`/courses/${course.id}`}>
          <button className="text-purple-600 hover:underline">
            View Modules
          </button>
        </Link>
        {!isAdmin && !isEnrolled && (
          <button
            className="text-purple-600 hover:underline"
            onClick={handleEnroll}
          >
            Enroll
          </button>
        )}
        {!isAdmin && isEnrolled && (
          <button
            className="text-purple-600 hover:underline"
            onClick={handleUnEnroll}
          >
            UnEnroll
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
