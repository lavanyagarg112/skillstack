"use client";

import ModuleCard, { Module } from "./ModuleCard";

interface Props {
  modules: Module[];
}

export default function ModuleList({ modules }: Props) {
  if (modules.length === 0) {
    return <p className="text-gray-600">No modules added yet.</p>;
  }
  // assume modules already sorted by position???
  return (
    <div className="space-y-4">
      {modules.map((m) => (
        <ModuleCard key={m.id} module={m} />
      ))}
    </div>
  );
}
