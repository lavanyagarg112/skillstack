"use client";

import { useState, useEffect } from "react";

interface Tag {
  id: number;
  name: string;
}

export default function ManageTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newName, setNewName] = useState("");

  const fetchTags = () =>
    fetch("/api/courses/tags", { credentials: "include" })
      .then((r) => r.json())
      .then(setTags)
      .catch(console.error);

  useEffect(() => {
    fetchTags();
  }, []);

  const addTag = async () => {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/courses/add-tags", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: [{ name }] }),
    });
    if (res.ok) {
      setNewName("");
      fetchTags();
    } else {
      alert("Failed to add tag");
    }
  };

  const deleteTag = async (id: number) => {
    if (
      !confirm(
        "Delete this tag? All courses and modules will no longer have this tag"
      )
    )
      return;
    const res = await fetch("/api/courses/delete-tag", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId: id }),
    });
    if (res.ok) fetchTags();
    else alert("Delete failed");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Tags</h1>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="New tag name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="
            w-full             /* mobile: full width */
            sm:w-64            /* desktop: ~16rem */
            p-2 border rounded 
            focus:outline-none focus:ring
          "
        />
        <button
          onClick={addTag}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Add Tag
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t.id}
            className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
          >
            {t.name}
            <button
              onClick={() => deleteTag(t.id)}
              className="ml-2 -mr-1 p-1 rounded-full hover:bg-red-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 hover:text-red-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 
                  111.414 1.414L11.414 10l4.293 4.293a1 1 0 
                  01-1.414 1.414L10 11.414l-4.293 4.293a1 1 
                  0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 
                  0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
