"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Module {
  id: number;
  title: string;
  module_type: string;
  position: number;
}

interface Props {
  module: Module;
  isEditMode: boolean;
}

export default function ModuleCard({ module, isEditMode }: Props) {
  const { courseId } = useParams() as { courseId: string };
  const [editingMode, setEditingMode] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch("/api/courses/delete-module", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId: module.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete module");
      }

      router.push(`/courses`);
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module. Please try again.");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-purple-600">
            {module.position}. {module.title}
          </h3>
          <p className="text-sm text-gray-500 capitalize">
            {module.module_type}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/courses/${courseId}/modules/${module.id}`}>
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded">
              Open
            </button>
          </Link>
          {isEditMode && !editingMode && (
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              onClick={() => setEditingMode(true)}
            >
              Edit
            </button>
          )}
          {isEditMode && editingMode && (
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                onClick={() => setEditingMode(false)}
              >
                Save
              </button>
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
