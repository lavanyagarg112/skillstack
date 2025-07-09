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

interface Channel {
  id: number;
  name: string;
  description?: string;
}

interface Level {
  id: number;
  name: string;
  description?: string;
  sort_order?: number;
}

interface UserChannel {
  id: number;
  channel_id: number;
  channel_name: string;
  channel_description?: string;
  preference_rank: number;
}

interface UserLevel {
  id: number;
  level_id: number;
  level_name: string;
  level_description?: string;
  sort_order?: number;
  preference_rank: number;
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
  
  // Channel and Level preferences
  const [userChannels, setUserChannels] = useState<UserChannel[]>([]);
  const [userLevels, setUserLevels] = useState<UserLevel[]>([]);
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);
  const [availableLevels, setAvailableLevels] = useState<Level[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [selectedPreferenceLevel, setSelectedPreferenceLevel] = useState<string>("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUserSkills();
    loadUserPreferences();
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
    }
  };

  const loadUserPreferences = async () => {
    try {
      const res = await fetch("/api/users/preferences", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load preferences");
      const data = await res.json();
      setUserChannels(data.userChannels || []);
      setUserLevels(data.userLevels || []);
      setAvailableChannels(data.availableChannels || []);
      setAvailableLevels(data.availableLevels || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load preferences");
      console.error("Error loading preferences:", err);
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

  const handleAddChannel = async () => {
    if (!selectedChannel) return;
    
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/preferences/channels", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: parseInt(selectedChannel),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add channel preference");
      }
      
      await loadUserPreferences();
      setSelectedChannel("");
      setMessage("Channel preference added successfully");
    } catch (err: any) {
      setError(err.message || "Failed to add channel preference");
      console.error("Error adding channel preference:", err);
    }
  };

  const handleAddLevel = async () => {
    if (!selectedPreferenceLevel) return;
    
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/preferences/levels", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level_id: parseInt(selectedPreferenceLevel),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add level preference");
      }
      
      await loadUserPreferences();
      setSelectedPreferenceLevel("");
      setMessage("Level preference added successfully");
    } catch (err: any) {
      setError(err.message || "Failed to add level preference");
      console.error("Error adding level preference:", err);
    }
  };

  const handleRemoveChannel = async (channelId: number) => {
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/preferences/channels", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_id: channelId,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove channel preference");
      }
      
      await loadUserPreferences();
      setMessage("Channel preference removed successfully");
    } catch (err: any) {
      setError(err.message || "Failed to remove channel preference");
      console.error("Error removing channel preference:", err);
    }
  };

  const handleRemoveLevel = async (levelId: number) => {
    setError(null);
    setMessage(null);
    
    try {
      const res = await fetch("/api/users/preferences/levels", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level_id: levelId,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove level preference");
      }
      
      await loadUserPreferences();
      setMessage("Level preference removed successfully");
    } catch (err: any) {
      setError(err.message || "Failed to remove level preference");
      console.error("Error removing level preference:", err);
    }
  };

  const getAvailableSkillsForAdding = () => {
    const userSkillIds = userSkills.map(us => us.skill_id);
    return availableSkills.filter(skill => !userSkillIds.includes(skill.id));
  };

  const getAvailableChannelsForAdding = () => {
    const userChannelIds = userChannels.map(uc => uc.channel_id);
    return availableChannels.filter(channel => !userChannelIds.includes(channel.id));
  };

  const getAvailableLevelsForAdding = () => {
    const userLevelIds = userLevels.map(ul => ul.level_id);
    return availableLevels.filter(level => !userLevelIds.includes(level.id));
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
    <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-purple-700">
        Learning Preferences
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Skills Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-800 border-b pb-2">Skills</h3>
        
        {/* Add New Skill */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-medium mb-4 text-gray-700">Add New Skill</h4>
          <div className="space-y-3">
            <div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level
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
            <button
              onClick={handleAddSkill}
              disabled={!selectedSkill}
              className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Skill
            </button>
          </div>
        </div>

        {/* Current Skills */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-700">Current Skills</h4>
          {userSkills.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No skills added yet.</p>
          ) : (
            <div className="space-y-2">
              {userSkills.map(userSkill => (
                <div key={userSkill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 text-sm">{userSkill.skill_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={userSkill.level}
                      onChange={(e) => handleUpdateSkill(userSkill.skill_id, e.target.value)}
                      className="rounded-md border border-gray-300 p-1 text-xs focus:border-purple-700 focus:ring focus:ring-purple-200"
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
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Channels Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-800 border-b pb-2">Preferred Channels</h3>
        
        {/* Add New Channel */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-lg font-medium mb-4 text-gray-700">Add Channel Preference</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="">Select a channel...</option>
                {getAvailableChannelsForAdding().map(channel => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddChannel}
              disabled={!selectedChannel}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Channel
            </button>
          </div>
        </div>

        {/* Current Channels */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-700">Current Preferences</h4>
          {userChannels.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No channel preferences set.</p>
          ) : (
            <div className="space-y-2">
              {userChannels.map(userChannel => (
                <div key={userChannel.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-blue-50">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 text-sm">{userChannel.channel_name}</span>
                    {userChannel.channel_description && (
                      <p className="text-xs text-gray-600 mt-1">{userChannel.channel_description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveChannel(userChannel.channel_id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Levels Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-800 border-b pb-2">Preferred Levels</h3>
        
        {/* Add New Level */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-lg font-medium mb-4 text-gray-700">Add Level Preference</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                value={selectedPreferenceLevel}
                onChange={(e) => setSelectedPreferenceLevel(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:ring focus:ring-green-200"
              >
                <option value="">Select a level...</option>
                {getAvailableLevelsForAdding().map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddLevel}
              disabled={!selectedPreferenceLevel}
              className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Level
            </button>
          </div>
        </div>

        {/* Current Levels */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-700">Current Preferences</h4>
          {userLevels.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No level preferences set.</p>
          ) : (
            <div className="space-y-2">
              {userLevels.map(userLevel => (
                <div key={userLevel.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-green-50">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 text-sm">{userLevel.level_name}</span>
                    {userLevel.level_description && (
                      <p className="text-xs text-gray-600 mt-1">{userLevel.level_description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveLevel(userLevel.level_id)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      </div>

      {error && (
        <div className="text-red-600 text-sm mt-6 text-center bg-red-50 p-3 rounded">{error}</div>
      )}
      {message && (
        <div className="text-green-600 text-sm mt-6 text-center bg-green-50 p-3 rounded">
          {message}
        </div>
      )}
    </div>
  );
}