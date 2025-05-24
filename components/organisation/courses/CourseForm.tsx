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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, description };

    if (mode === "create") {
      // add api call to create a new course
      router.push("/courses");
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

      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
      >
        {mode === "create" ? "Create Course" : "Save Changes"}
      </button>
    </form>
  );
}
