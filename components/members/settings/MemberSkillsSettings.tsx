"use client";
import { useState, useEffect } from "react";

interface Skill {
  id: number;
  name: string;
}

interface UserSkill {
  id: number;
  skill_id: number;
  skill_name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

export default function MemberSkillsSettings() {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("beginner");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUserSkills();
  }, []);

  const loadUserSkills = async () => {
    try {
      const res = await fetch("/api/users/skills", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load skills");
      const data = await res.json();
      setUserSkills(data.userSkills || []);
      setAvailableSkills(data.availableSkills || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load skills");
      console.error("Error loading skills:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkill) return;
    
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/skills", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_id: parseInt(selectedSkill),
          level: selectedLevel,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add skill");
      }
      
      await loadUserSkills();
      setSelectedSkill("");
      setSelectedLevel("beginner");
      setMessage("Skill added successfully");
    } catch (err: any) {
      setError(err.message || "Failed to add skill");
      console.error("Error adding skill:", err);
    }
  };

  const handleUpdateSkill = async (skillId: number, newLevel: string) => {
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/skills", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_id: skillId,
          level: newLevel,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update skill");
      }
      
      await loadUserSkills();
      setMessage("Skill updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update skill");
      console.error("Error updating skill:", err);
    }
  };

  const handleRemoveSkill = async (skillId: number) => {
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/skills", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_id: skillId,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove skill");
      }
      
      await loadUserSkills();
      setMessage("Skill removed successfully");
    } catch (err: any) {
      setError(err.message || "Failed to remove skill");
      console.error("Error removing skill:", err);
    }
  };

  const getAvailableSkillsForAdding = () => {
    const userSkillIds = userSkills.map(us => us.skill_id);
    return availableSkills.filter(skill => !userSkillIds.includes(skill.id));
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-purple-700">
        Skills Management
      </h2>
      
      {/* Add New Skill */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-gray-700">Add New Skill</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
            >
              <option value="">Select a skill...</option>
              {getAvailableSkillsForAdding().map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-purple-200"
            >
              {SKILL_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddSkill}
              disabled={!selectedSkill}
              className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>

      {/* Current Skills */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-700">Current Skills</h3>
        {userSkills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No skills added yet. Add some skills above to get started!</p>
        ) : (
          <div className="space-y-3">
            {userSkills.map(userSkill => (
              <div key={userSkill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{userSkill.skill_name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={userSkill.level}
                    onChange={(e) => handleUpdateSkill(userSkill.skill_id, e.target.value)}
                    className="rounded-md border border-gray-300 p-1 text-sm focus:border-purple-700 focus:ring focus:ring-purple-200"
                  >
                    {SKILL_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveSkill(userSkill.skill_id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-4 text-center">{error}</div>
      )}
      {message && (
        <div className="text-green-600 text-sm mt-4 text-center">
          {message}
        </div>
      )}
    </div>
  );
}