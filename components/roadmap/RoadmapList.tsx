import { useState } from "react";
import { Roadmap } from "./types";

interface Props {
  roadmaps: Roadmap[];
  onSelect: (roadmap: Roadmap) => void;
  onDelete: (roadmapId: number) => void;
  onCreateNew: () => void;
  onAutoGenerate: () => Promise<{
    roadmap?: Roadmap;
    modulesAdded?: number;
  } | void>;
}

export default function RoadmapList({
  roadmaps,
  onSelect,
  onDelete,
  onCreateNew,
  onAutoGenerate,
}: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [autoGenMessage, setAutoGenMessage] = useState<string | null>(null);

  const handleDelete = async (roadmapId: number) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;

    setDeletingId(roadmapId);
    try {
      await onDelete(roadmapId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAutoGenerate = async () => {
    setAutoGenMessage(null);
    try {
      const result = await onAutoGenerate();
      if (
        !result ||
        (result.modulesAdded !== undefined && result.modulesAdded === 0)
      ) {
        setAutoGenMessage(
          "No new modules to recommend. You can create it manually if you want."
        );
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to auto-generate roadmap.";
      if (msg.toLowerCase().includes("same set of modules")) {
        setAutoGenMessage(
          "No new modules to recommend. You can create it manually if you want."
        );
      } else {
        setAutoGenMessage(msg);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-purple-600">
          My Learning Roadmaps
        </h2>
        <div className="space-x-2">
          <button
            onClick={handleAutoGenerate}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            ✨ Auto-Generate
          </button>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            + Create New
          </button>
        </div>
      </div>

      {autoGenMessage && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded flex justify-between items-center">
          <span>{autoGenMessage}</span>
          <button
            onClick={() => setAutoGenMessage(null)}
            className="ml-4 font-bold text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {roadmaps.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any roadmaps yet.</p>
          <div className="space-x-3">
            <button
              onClick={handleAutoGenerate}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              ✨ Auto-Generate Roadmap
            </button>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Create Empty Roadmap
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {roadmap.name}
              </h3>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => onSelect(roadmap)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  View & Edit
                </button>
                <button
                  onClick={() => handleDelete(roadmap.id)}
                  disabled={deletingId === roadmap.id}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-50"
                >
                  {deletingId === roadmap.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
