"use client";

import { useState, useEffect } from "react";

interface Tag {
  id: number;
  name: string;
}

export default function ManageTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newName, setNewName] = useState("");

  const fetchTags = () => {
    fetch("/api/courses/tags", { credentials: "include" })
      .then((r) => r.json())
      .then(setTags)
      .catch(console.error);
  };

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
    if (!confirm("Are you sure you want to delete this tag?")) return;
    const res = await fetch("/api/courses/delete-tag", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId: id }),
    });
    if (res.ok) {
      fetchTags();
    } else {
      alert("Failed to delete tag");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Tags</h1>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addTag}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Add Tag
        </button>
      </div>

      <ul className="space-y-2">
        {tags.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <span>{t.name}</span>
            <button
              onClick={() => deleteTag(t.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
