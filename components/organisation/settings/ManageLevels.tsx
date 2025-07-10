"use client";

import { useState, useEffect } from "react";

interface Level {
  id: number;
  name: string;
  description: string;
  sort_order: number;
}

export default function ManageLevels() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSortOrder, setNewSortOrder] = useState("");

  const fetchLevels = () =>
    fetch("/api/courses/levels", { credentials: "include" })
      .then((r) => r.json())
      .then(setLevels)
      .catch(console.error);

  useEffect(() => {
    fetchLevels();
  }, []);

  const addLevel = async () => {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/courses/add-level", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        description: newDescription.trim(),
        sort_order: newSortOrder ? parseInt(newSortOrder) : 0
      }),
    });
    if (res.ok) {
      setNewName("");
      setNewDescription("");
      setNewSortOrder("");
      fetchLevels();
    } else {
      alert("Failed to add level");
    }
  };

  const deleteLevel = async (id: number) => {
    if (
      !confirm(
        "Delete this level? All courses using this level will be affected"
      )
    )
      return;
    const res = await fetch("/api/courses/delete-level", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levelId: id }),
    });
    if (res.ok) fetchLevels();
    else alert("Delete failed");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Levels</h1>
      <p className="text-gray-600">Levels represent difficulty or progression stages for courses</p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Level name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring"
          />
          <input
            type="number"
            placeholder="Sort order"
            value={newSortOrder}
            onChange={(e) => setNewSortOrder(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring"
          />
          <div></div>
        </div>
        <textarea
          placeholder="Level description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring"
          rows={3}
        />
        <button
          onClick={addLevel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Add Level
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {levels.map((level) => (
          <div
            key={level.id}
            className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex justify-between items-start"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-base truncate">{level.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {level.sort_order}
                </span>
              </div>
              {level.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{level.description}</p>
              )}
            </div>
            <button
              onClick={() => deleteLevel(level.id)}
              className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded flex-shrink-0"
              title="Delete level"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 012 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 012 0v3a1 1 0 11-2 0V9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}