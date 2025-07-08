"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export interface Tag {
  id: number;
  name: string;
}

export interface Module {
  id: number;
  title: string;
  module_type: string;
  position: number;
  tags?: Tag[];
}

interface Props {
  module: Module;
  isEditMode: boolean;
  isEnrolled: boolean;
}

export default function ModuleCard({ module, isEditMode, isEnrolled }: Props) {
  const { courseId } = useParams() as { courseId: string };
  const [moduleStatus, setModuleStatus] = useState<string | null>(null);

  useEffect(() => {
    async function checkModuleStatus() {
      try {
        const response = await fetch(`/api/courses/get-module-status`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moduleId: module.id }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch module status");
        }
        const data = await response.json();
        setModuleStatus(data.status || null);
      } catch (error) {
        console.error("Error fetching module status:", error);
        setModuleStatus(null);
      }
    }
    if (isEnrolled && !isEditMode) {
      checkModuleStatus();
    }
  }, [module.id]);

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
          {!!module.tags?.length && (
            <div className="mt-2 flex flex-wrap gap-1">
              {module.tags.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                >
                  {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {(isEnrolled || isEditMode) && (
            <Link href={`/courses/${courseId}/modules/${module.id}`}>
              <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded">
                {moduleStatus === "completed"
                  ? "View Completed Module"
                  : moduleStatus === "in_progress"
                  ? "Continue"
                  : "View"}
              </button>
            </Link>
          )}
          {!isEnrolled && !isEditMode && (
            <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded">
              Enroll to View
            </button>
          )}
          {isEditMode && (
            <Link href={`/courses/${courseId}/modules/${module.id}/edit`}>
              <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded">
                Edit
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
