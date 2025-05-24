"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export interface Module {
  id: number;
  title: string;
  module_type: string;
  position: number;
}

interface Props {
  module: Module;
}

export default function ModuleCard({ module }: Props) {
  const { courseId } = useParams() as { courseId: string };

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
        <Link href={`/courses/${courseId}/modules/${module.id}`}>
          <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded">
            Open
          </button>
        </Link>
      </div>
    </div>
  );
}
