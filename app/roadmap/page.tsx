"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import RoadmapList from "@/components/roadmap/RoadmapList";
import RoadmapEditor from "@/components/roadmap/RoadmapEditor";
import { Roadmap } from "@/components/roadmap/types";

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await fetch("/api/roadmaps", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoadmaps(data.roadmaps || []);
      }
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewRoadmap = async () => {
    const name = prompt("Enter roadmap name:");
    if (!name?.trim()) return;

    try {
      const response = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmaps([data.roadmap, ...roadmaps]);
        setSelectedRoadmap(data.roadmap);
      }
    } catch (error) {
      console.error("Failed to create roadmap:", error);
    }
  };

  const autoGenerateRoadmap = async () => {
    const name = prompt("Enter roadmap name:", "My AI-Generated Roadmap");
    if (!name?.trim()) return;

    try {
      const response = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmaps([data.roadmap, ...roadmaps]);
        setSelectedRoadmap(data.roadmap);
        
        if (data.modulesAdded > 0) {
          alert(`Generated roadmap with ${data.modulesAdded} recommended modules based on your skills! You've been auto-enrolled in ${data.enrolledCourses} courses.`);
        } else {
          alert("Generated empty roadmap - no modules found matching your skills. You can add modules manually.");
        }
      }
    } catch (error) {
      console.error("Failed to auto-generate roadmap:", error);
    }
  };

  const deleteRoadmap = async (roadmapId: number) => {
    try {
      const response = await fetch(`/api/roadmaps/${roadmapId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setRoadmaps(roadmaps.filter(r => r.id !== roadmapId));
        if (selectedRoadmap?.id === roadmapId) {
          setSelectedRoadmap(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete roadmap:", error);
    }
  };

  const updateRoadmap = (updatedRoadmap: Roadmap) => {
    setRoadmaps(roadmaps.map(r => 
      r.id === updatedRoadmap.id ? updatedRoadmap : r
    ));
    setSelectedRoadmap(updatedRoadmap);
  };

  if (loading) {
    return <div className="text-center py-8">Loading your roadmaps...</div>;
  }

  if (selectedRoadmap) {
    return (
      <RoadmapEditor
        roadmap={selectedRoadmap}
        onBack={() => setSelectedRoadmap(null)}
        onUpdate={updateRoadmap}
      />
    );
  }

  return (
    <RoadmapList
      roadmaps={roadmaps}
      onSelect={setSelectedRoadmap}
      onDelete={deleteRoadmap}
      onCreateNew={createNewRoadmap}
      onAutoGenerate={autoGenerateRoadmap}
    />
  );
}
