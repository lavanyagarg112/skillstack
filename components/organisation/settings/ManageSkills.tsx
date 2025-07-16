"use client";

import { useState, useEffect } from "react";

interface Skill {
  id: number;
  name: string;
  description: string;
}

export default function ManageSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchSkills = () =>
    fetch("/api/courses/skills", { credentials: "include" })
      .then((r) => r.json())
      .then(setSkills)
      .catch(console.error);

  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async () => {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/courses/add-skill", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        description: newDescription.trim() 
      }),
    });
    if (res.ok) {
      setNewName("");
      setNewDescription("");
      fetchSkills();
    } else {
      alert("Failed to add skill");
    }
  };

  const deleteSkill = async (id: number) => {
    if (
      !confirm(
        "Delete this skill? All modules using this skill will be affected"
      )
    )
      return;
    const res = await fetch("/api/courses/delete-skill", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: id }),
    });
    if (res.ok) fetchSkills();
    else alert("Delete failed");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Skills</h1>
      <p className="text-gray-600">Skills are used to categorize modules and track user progress</p>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Skill name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
          />
          <textarea
            placeholder="Skill description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            rows={3}
          />
        </div>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex justify-between items-start"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate">{skill.name}</h3>
              {skill.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{skill.description}</p>
              )}
            </div>
            <button
              onClick={() => deleteSkill(skill.id)}
              className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded flex-shrink-0"
              title="Delete skill"
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