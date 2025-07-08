"use client";

import { useState, useEffect } from "react";

interface Tag {
  id: number;
  name: string;
}

export default function ManageTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/courses/tags", { credentials: "include" })
      .then((r) => r.json())
      .then(setTags);
  }, []);

  const addTag = async () => {
    if (!newName.trim()) return;
    const res = await fetch("/api/courses/add-tags", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: [{ name: newName.trim() }] }),
    });
    if (res.ok) {
      setNewName("");
      // reload
      fetch("/api/courses/tags", { credentials: "include" })
        .then((r) => r.json())
        .then(setTags);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Tags</h1>

      <div className="space-y-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New tag name"
          className="p-2 border rounded"
        />
        <button
          onClick={addTag}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Add Tag
        </button>
      </div>

      <ul className="list-disc pl-5">
        {tags.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  );
}
