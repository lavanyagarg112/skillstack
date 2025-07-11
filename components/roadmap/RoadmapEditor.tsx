"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  // const [channelRecommendations, setChannelRecommendations] = useState<{[key: string]: Module[]}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  // const [showChannelRecommendations, setShowChannelRecommendations] =
  // useState(false);

  useEffect(() => {
    fetchRoadmapItems();
    fetchAvailableModules();
    // fetchChannelRecommendations();
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
      const userSkillResponse = await fetch("/api/materials/by-user-skills", {
        credentials: "include",
      });

      let userRecommendedModules = [];
      if (userSkillResponse.ok) {
        const userData = await userSkillResponse.json();
        userRecommendedModules = userData.materials || [];
      }

      const allResponse = await fetch("/api/materials", {
        credentials: "include",
      });

      let allModules = [];
      if (allResponse.ok) {
        const allData = await allResponse.json();
        allModules = allData.materials || [];
      }

      const recommendedIds = new Set(
        userRecommendedModules.map((m: Module) => m.id)
      );
      const otherModules = allModules.filter(
        (m: Module) => !recommendedIds.has(m.id)
      );

      setAvailableModules([...userRecommendedModules, ...otherModules]);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      setAvailableModules([]);
    }
  };

  // const fetchChannelRecommendations = async () => {
  //   try {
  //     const response = await fetch("/api/materials/by-user-skills", {
  //       credentials: "include",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const modules = data.materials || [];

  //       // Group modules by channel
  //       const groupedByChannel: { [key: string]: Module[] } = {};

  //       modules.forEach((module: Module) => {
  //         if (module.channel) {
  //           const channelName = module.channel.name;
  //           if (!groupedByChannel[channelName]) {
  //             groupedByChannel[channelName] = [];
  //           }
  //           groupedByChannel[channelName].push(module);
  //         }
  //       });

  //       // Sort channels by number of modules and limit to top 3 modules per channel
  //       const sortedChannels: { [key: string]: Module[] } = {};
  //       Object.entries(groupedByChannel)
  //         .sort(([, a], [, b]) => b.length - a.length)
  //         .forEach(([channel, modules]) => {
  //           sortedChannels[channel] = modules.slice(0, 3);
  //         });

  //       setChannelRecommendations(sortedChannels);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch channel recommendations:", error);
  //     setChannelRecommendations({});
  //   }
  // };

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
      const response = await fetch(
        `/api/roadmaps/${roadmap.id}/items/${moduleId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setItems(items.filter((item) => item.module_id !== moduleId));
      }
    } catch (error) {
      console.error("Failed to remove module:", error);
    }
  };

  const handleNotEnrolledClick = async (item: RoadmapItem) => {
    if (
      !confirm(
        `You need to enroll in "${item.course_name}" to access this module. Enroll now?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/courses/enroll-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: item.course_id }),
      });

      if (response.ok) {
        await fetchRoadmapItems();
        window.location.href = `/courses/${item.course_id}/modules/${item.module_id}`;
      } else {
        const data = await response.json();
        alert(`Failed to enroll: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to enroll in course:", error);
      alert("Failed to enroll in course. Please try again.");
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
          <div className="space-x-2">
            {/* <button
              onClick={() => setShowChannelRecommendations(true)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
              title="View channel-based recommendations"
            >
              📚 Channel Recommendations
            </button>
            <button
              onClick={fetchRoadmapItems}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
              title="Refresh enrollment status"
            >
              🔄 Refresh
            </button> */}
            <button
              onClick={() => setShowModuleSelector(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              + Add Module
            </button>
          </div>
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
            {items.map((item, index) => {
              const moduleUrl = `/courses/${item.course_id}/modules/${item.module_id}`;
              const isAccessible = item.enrollment_status === "enrolled";
              const wasManuallyUnenrolled =
                item.enrollment_status === "not_enrolled" &&
                (item.module_status === "in_progress" ||
                  item.module_status === "completed");

              return (
                <div
                  key={item.module_id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    wasManuallyUnenrolled
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{item.module_title}</h4>
                        {isAccessible ? (
                          <Link href={moduleUrl}>
                            <button
                              className={`px-3 py-1 text-sm rounded text-white ${
                                item.module_status === "completed"
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : item.module_status === "in_progress"
                                  ? "bg-orange-600 hover:bg-orange-700"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              {item.module_status === "completed"
                                ? "Review"
                                : item.module_status === "in_progress"
                                ? "Continue"
                                : "Start"}
                            </button>
                          </Link>
                        ) : wasManuallyUnenrolled ? (
                          <button
                            onClick={() => handleNotEnrolledClick(item)}
                            className="px-3 py-1 text-sm rounded bg-red-500 hover:bg-red-600 text-white"
                            title="You were unenrolled from this course. Click to re-enroll and continue."
                          >
                            Re-enroll
                          </button>
                        ) : (
                          <button
                            onClick={() => handleNotEnrolledClick(item)}
                            className="px-3 py-1 text-sm rounded bg-gray-400 hover:bg-gray-500 text-white"
                            title="Click to enroll and access this module"
                          >
                            Enroll & Start
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>
                          {item.course_name} • {item.module_type}
                        </span>
                        {(item.channel || item.level) && (
                          <div className="flex gap-1">
                            {item.channel && (
                              <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {item.channel.name}
                              </span>
                            )}
                            {item.level && (
                              <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {item.level.name}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                      {wasManuallyUnenrolled && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          ⚠️ Access lost: You were manually unenrolled from this
                          course
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.enrollment_status === "enrolled"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.enrollment_status === "enrolled"
                            ? "Enrolled"
                            : "Not Enrolled"}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.module_status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : item.module_status === "in_progress"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.module_status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeModule(item.module_id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm ml-2"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
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
                  .filter(
                    (module) =>
                      !items.some((item) => item.module_id === module.id)
                  )
                  .map((module, index) => {
                    const isRecommended =
                      module.matching_skills && module.matching_skills > 0;
                    return (
                      <div
                        key={module.id}
                        className={`flex items-center justify-between p-3 border rounded hover:bg-gray-50 ${
                          isRecommended ? "border-green-200 bg-green-50" : ""
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">
                              {module.module_title}
                            </h4>
                            {isRecommended && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                ✨ Recommended
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>
                              {module.course_name} • {module.module_type}
                            </span>
                            {(module.channel || module.level) && (
                              <div className="flex gap-1">
                                {module.channel && (
                                  <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {module.channel.name}
                                  </span>
                                )}
                                {module.level && (
                                  <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    {module.level.name}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {module.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {module.description}
                            </p>
                          )}
                          {module.skills && (
                            <p className="text-xs text-gray-500 mt-1">
                              Skills:{" "}
                              {module.skills
                                .filter((skill) => skill)
                                .join(", ") || "None"}
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

      {/* {showChannelRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Channel-Based Recommendations
              </h3>
              <button
                onClick={() => setShowChannelRecommendations(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {Object.keys(channelRecommendations).length === 0 ? (
              <p className="text-gray-600">
                No channel-based recommendations available.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(channelRecommendations).map(
                  ([channelName, modules]) => (
                    <div key={channelName} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium mr-2">
                          {channelName}
                        </span>
                        <span className="text-sm text-gray-600">
                          ({modules.length} modules)
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {modules
                          .filter(
                            (module) =>
                              !items.some(
                                (item) => item.module_id === module.id
                              )
                          )
                          .map((module) => (
                            <div
                              key={module.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium">
                                    {module.module_title}
                                  </h5>
                                  {module.level && (
                                    <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                      {module.level.name}
                                    </span>
                                  )}
                                  {module.matching_skills &&
                                    module.matching_skills > 0 && (
                                      <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {module.matching_skills} skills match
                                      </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {module.course_name} • {module.module_type}
                                </p>
                                {module.description && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {module.description}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  addModule(module.id);
                                  setShowChannelRecommendations(false);
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm ml-2"
                              >
                                Add to Roadmap
                              </button>
                            </div>
                          ))}
                        {modules.filter(
                          (module) =>
                            !items.some((item) => item.module_id === module.id)
                        ).length === 0 && (
                          <p className="text-sm text-gray-500 italic">
                            All modules from this channel are already in your
                            roadmap.
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
