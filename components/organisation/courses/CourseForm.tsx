// components/organisation/courses/CourseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface Course {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  mode: "create" | "edit";
  courseId?: string;
}

export default function CourseForm({ mode, courseId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCourse() {
      const response = await fetch(
        `http://localhost:4000/api/courses/get-course`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch course");
        }
        return res.json();
      });
      setName(response.name);
      setDescription(response.description || "");
    }
    if (mode === "edit" && courseId) {
      // Fetch course details if in edit mode
      fetchCourse().catch((error) => {
        console.error("Error fetching course:", error);
        alert("Failed to load course data. Please try again.");
        router.push("/courses");
      });
    }
  }, []);

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
          credentials: "include",
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
    } else {
      try {
        const res = await fetch("/api/courses", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ courseId: courseId, ...payload }),
        });
        if (!res.ok) {
          throw new Error("Failed to update course");
        }
        const data = await res.json();
        console.log("Course updated:", data);
        router.push("/courses");
      } catch (error) {
        console.error("Error creating course:", error);
        alert("Failed to update course. Please try again.");
        return;
      }
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }
    if (!courseId) {
      alert("Please provide a course name to delete.");
      return;
    }
    try {
      const res = await fetch(`/api/courses`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ courseId: courseId }),
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
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={(e) => handleDelete(e)}
          >
            Delete Course
          </button>
        )}
      </div>
    </form>
  );
}
