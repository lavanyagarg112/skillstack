"use client";

import Link from "next/link";

export interface Channel {
  id: number;
  name: string;
  description?: string;
}

export interface Level {
  id: number;
  name: string;
  description?: string;
  sort_order?: number;
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  total_modules?: number;
  completed_modules?: number;
  channel?: Channel;
  level?: Level;
}

interface Props {
  course: Course;
  isAdmin: boolean;
  isEnrolled: boolean;
  isCompleted: boolean;
}

export default function CourseCard({
  course,
  isAdmin,
  isEnrolled,
  isCompleted,
}: Props) {
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

  const markNotCompleted = async () => {
    const result = confirm(
      "Are you sure you want to mark this course as not completed? You will lose corresponding badges."
    );

    if (!result) return;
    try {
      const response = await fetch("/api/courses/uncomplete-course", {
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

  const handleCompleteCourse = async () => {
    try {
      const res = await fetch("/api/courses/complete-course", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (!res.ok) throw new Error("Failed to complete course");

      const data = await res.json();
      const { specificBadges = [], earnedBadges = [] } = data;

      const msgs: string[] = [];
      if (specificBadges.length) {
        msgs.push(
          `Course badge earned: ${specificBadges
            .map((b: any) => b.name)
            .join(", ")}`
        );
      }
      if (earnedBadges.length) {
        msgs.push(
          `Milestone badge earned: ${earnedBadges
            .map((b: any) => b.name)
            .join(", ")}`
        );
      }
      if (msgs.length) {
        alert(msgs.join("\n"));
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Could not mark course complete");
    }
  };

  const allDone =
    course.total_modules &&
    course.completed_modules === course.total_modules &&
    course.total_modules > 0;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold text-purple-600">{course.name}</h2>
      <p className="mt-2 text-gray-700">
        {course.description && course.description?.length < 100
          ? course.description
          : `${course.description?.slice(0, 100)}...`}
      </p>

      {(course.channel || course.level) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {course.channel && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {course.channel.name}
            </span>
          )}
          {course.level && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {course.level.name}
            </span>
          )}
        </div>
      )}

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

      {allDone && !isAdmin && !isCompleted && (
        <button
          onClick={handleCompleteCourse}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Mark Course as Completed
        </button>
      )}

      <div className="mt-4 flex items-center space-x-4">
        <Link href={`/courses/${course.id}`}>
          <button className="text-purple-600 hover:underline">
            View Modules
          </button>
        </Link>
        {!isAdmin && !isEnrolled && !isCompleted && (
          <button
            className="text-purple-600 hover:underline"
            onClick={handleEnroll}
          >
            Enroll
          </button>
        )}
        {!isAdmin && isEnrolled && !isCompleted && (
          <button
            className="text-purple-600 hover:underline"
            onClick={handleUnEnroll}
          >
            UnEnroll
          </button>
        )}
        {!isAdmin && isCompleted && !allDone && (
          <button
            className="text-red-600 hover:underline"
            onClick={markNotCompleted}
          >
            New modules added, click to continue Course
          </button>
        )}
        {!isAdmin && isCompleted && allDone && (
          <button
            className="text-red-600 hover:underline"
            onClick={markNotCompleted}
          >
            Mark as Not Completed
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
