"use client";

import { useState, useEffect } from "react";
import { Roadmap, RoadmapItem, Module } from "./types";

interface Props {
  roadmap: Roadmap;
  onBack: () => void;
  onUpdate: (roadmap: Roadmap) => void;
}

export default function RoadmapEditor({ roadmap, onBack, onUpdate }: Props) {
  const [roadmapName, setRoadmapName] = useState(roadmap.name);
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModuleSelector, setShowModuleSelector] = useState(false);

  useEffect(() => {
    fetchRoadmapItems();
    fetchAvailableModules();
  }, [roadmap.id]);

  const fetchRoadmapItems = async () => {
    try {
      const response = await fetch(`/api/roadmaps/${roadmap.id}/items`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch roadmap items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableModules = async () => {
    try {
      // Get user-tag-based recommendations first
      const userTagResponse = await fetch("/api/materials/by-user-tags", {
        credentials: "include",
      });
      
      let userRecommendedModules = [];
      if (userTagResponse.ok) {
        const userData = await userTagResponse.json();
        userRecommendedModules = userData.materials || [];
      }

      // Then get all modules
      const allResponse = await fetch("/api/materials", {
        credentials: "include",
      });
      
      let allModules = [];
      if (allResponse.ok) {
        const allData = await allResponse.json();
        allModules = allData.materials || [];
      }

      // Combine with user recommendations first
      const recommendedIds = new Set(userRecommendedModules.map(m => m.id));
      const otherModules = allModules.filter(m => !recommendedIds.has(m.id));
      
      setAvailableModules([...userRecommendedModules, ...otherModules]);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      setAvailableModules([]);
    }
  };

  const updateRoadmapName = async () => {
    if (roadmapName.trim() === roadmap.name) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/roadmaps/${roadmap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: roadmapName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        onUpdate(data.roadmap);
      }
    } catch (error) {
      console.error("Failed to update roadmap name:", error);
    } finally {
      setSaving(false);
    }
  };

  const addModule = async (moduleId: number) => {
    try {
      const response = await fetch(`/api/roadmaps/${roadmap.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ module_id: moduleId }),
      });

      if (response.ok) {
        await fetchRoadmapItems();
        setShowModuleSelector(false);
      }
    } catch (error) {
      console.error("Failed to add module:", error);
    }
  };

  const removeModule = async (moduleId: number) => {
    if (!confirm("Remove this module from your roadmap?")) return;

    try {
      const response = await fetch(`/api/roadmaps/${roadmap.id}/items/${moduleId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setItems(items.filter(item => item.module_id !== moduleId));
      }
    } catch (error) {
      console.error("Failed to remove module:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading roadmap...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          ← Back to Roadmaps
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={roadmapName}
            onChange={(e) => setRoadmapName(e.target.value)}
            className="flex-1 text-2xl font-semibold border-b-2 border-transparent hover:border-gray-300 focus:border-purple-600 focus:outline-none"
            onBlur={updateRoadmapName}
            onKeyDown={(e) => e.key === "Enter" && updateRoadmapName()}
          />
          {saving && <span className="text-gray-500">Saving...</span>}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Learning Modules</h3>
          <button
            onClick={() => setShowModuleSelector(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            + Add Module
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No modules in this roadmap yet.</p>
            <button
              onClick={() => setShowModuleSelector(true)}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Add Your First Module
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.module_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.module_title}</h4>
                    <p className="text-sm text-gray-600">
                      {item.course_name} • {item.module_type}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.enrollment_status === 'enrolled' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.enrollment_status === 'enrolled' ? 'Enrolled' : 'Not Enrolled'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.module_status === 'completed' 
                          ? 'bg-blue-100 text-blue-800'
                          : item.module_status === 'in_progress'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.module_status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeModule(item.module_id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModuleSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Module to Roadmap</h3>
              <button
                onClick={() => setShowModuleSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {availableModules.length === 0 ? (
              <p className="text-gray-600">No modules available to add.</p>
            ) : (
              <div className="space-y-2">
                {availableModules
                  .filter(module => !items.some(item => item.module_id === module.id))
                  .map((module, index) => {
                    const isRecommended = module.matching_tags > 0;
                    return (
                      <div
                        key={module.id}
                        className={`flex items-center justify-between p-3 border rounded hover:bg-gray-50 ${
                          isRecommended ? 'border-green-200 bg-green-50' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{module.module_title}</h4>
                            {isRecommended && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                ✨ Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {module.course_name} • {module.module_type}
                          </p>
                          {module.description && (
                            <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                          )}
                          {module.tags && (
                            <p className="text-xs text-gray-500 mt-1">
                              Tags: {module.tags.filter(tag => tag).join(', ') || 'None'}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => addModule(module.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                        >
                          Add
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}