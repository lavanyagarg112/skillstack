"use client";

import ModuleCard, { Module } from "./ModuleCard";
import { useEffect, useState } from "react";

interface Props {
  courseId: string;
  isEditMode: boolean;
}

export default function ModuleList({ courseId, isEditMode }: Props) {
  const [modules, setModules] = useState<Module[]>([]);
  const [enrolled, setEnrolled] = useState<boolean>(false);

  useEffect(() => {
    async function fetchModules() {
      try {
        const response = await fetch(`/api/courses/get-modules`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }
        const data = await response.json();
        setModules(data.modules || []);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModules([]);
      }
    }
    async function checkEnrollmentInCourse() {
      try {
        const response = await fetch(`/api/courses/is-enrolled`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        });
        if (!response.ok) {
          throw new Error("Failed to check enrollment");
        }
        const data = await response.json();
        if (data.enrolled) {
          setEnrolled(true);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
        return;
      }
    }
    checkEnrollmentInCourse();
    fetchModules();
  }, [courseId]);

  if (modules.length === 0) {
    return <p className="text-gray-600">No modules added yet.</p>;
  }
  // assume modules already sorted by position???
  return (
    <div className="space-y-4">
      {modules.map((m) => (
        <ModuleCard
          key={m.id}
          module={m}
          isEditMode={isEditMode}
          isEnrolled={enrolled}
        />
      ))}
    </div>
  );
}
