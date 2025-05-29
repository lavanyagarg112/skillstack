// components/organisation/courses/CourseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Course {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  mode: "create" | "edit";
  course?: Course;
}

export default function CourseForm({ mode, course }: Props) {
  const [name, setName] = useState(course?.name ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { courseName: name, description };

    if (mode === "create") {
      try {
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("Failed to create course");
        }
        const data = await res.json();
        console.log("Course created:", data);
        router.push("/courses");
      } catch (error) {
        console.error("Error creating course:", error);
        alert("Failed to create course. Please try again.");
        return;
      }
    } else if (deleteMode) {
      if (!course?.id) {
        alert("Please provide a course name to delete.");
        return;
      }
      try {
        const res = await fetch(`/api/courses`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId: course.id }),
        });
        if (!res.ok) {
          throw new Error("Failed to delete course");
        }
        const data = await res.json();
        console.log("Course deleted:", data);
        router.push("/courses");
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
        return;
      }
    } else {
      // add api call to edit course
      router.push(`/courses/${course?.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
          rows={4}
        />
      </div>
      <div className="space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          {mode === "create" ? "Create Course" : "Save Changes"}
        </button>
        {mode === "edit" && (
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={(e) => {
              setDeleteMode(true);
            }}
          >
            Delete Course
          </button>
        )}
      </div>
    </form>
  );
}
