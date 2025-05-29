// components/organisation/courses/CourseForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
interface Props {
  mode: "create" | "edit";
  courseId: string;
}

export default function ModuleForm({ mode, courseId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [upload, setUpload] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // fetch module details
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/courses");
    // module endpoints - new or delete or edit
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
      <div>
        <label className="block text-gray-700">Upload Material</label>
        <textarea
          value={upload}
          onChange={(e) => setUpload(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
          rows={4}
        />
      </div>
      <div className="space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          {mode === "create" ? "Create Module" : "Save Changes"}
        </button>
        {mode === "edit" && (
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={(e) => {
              setDeleteMode(true);
            }}
          >
            Delete Module
          </button>
        )}
      </div>
    </form>
  );
}
