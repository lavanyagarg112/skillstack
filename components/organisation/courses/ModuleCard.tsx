"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
                onClick={() =>
                  alert("Delete module functionality not implemented yet")
                }
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
