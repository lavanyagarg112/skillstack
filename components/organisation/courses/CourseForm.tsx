"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

export interface Course {
  id: number;
  name: string;
  description?: string;
  channel?: { id: number; name: string; description?: string };
  level?: {
    id: number;
    name: string;
    description?: string;
    sort_order?: number;
  };
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
interface Option {
  value: number;
  label: string;
}

interface Props {
  mode: "create" | "edit";
  courseId?: string;
}

export default function CourseForm({ mode, courseId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [allLevels, setAllLevels] = useState<Level[]>([]);
  const [channelOptions, setChannelOptions] = useState<Option[]>([]);
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Option | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Option | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch channels
    fetch("/api/courses/channels", { credentials: "include" })
      .then((r) => r.json())
      .then((channels: Channel[]) => {
        setAllChannels(channels);
        setChannelOptions(
          channels.map((c) => ({ value: c.id, label: c.name }))
        );
      })
      .catch(console.error);

    // Fetch levels
    fetch("/api/courses/levels", { credentials: "include" })
      .then((r) => r.json())
      .then((levels: Level[]) => {
        setAllLevels(levels);
        setLevelOptions(levels.map((l) => ({ value: l.id, label: l.name })));
      })
      .catch(console.error);

    if (mode === "edit" && courseId) {
      fetch("/api/courses/get-course", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((course: Course) => {
          setName(course.name);
          setDescription(course.description || "");
          if (course.channel) {
            setSelectedChannel({
              value: course.channel.id,
              label: course.channel.name,
            });
          }
          if (course.level) {
            setSelectedLevel({
              value: course.level.id,
              label: course.level.name,
            });
          }
        })
        .catch((_) => {
          alert("Failed to load course");
          router.push("/courses");
        });
    }
  }, [mode, courseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChannel || !selectedLevel) {
      alert("Please select both channel and level");
      return;
    }

    const payload = {
      courseName: name,
      description,
      channelId: selectedChannel.value,
      levelId: selectedLevel.value,
      updateChannelLevel: mode === "edit",
    };

    const url = "/api/courses";
    const method = mode === "create" ? "POST" : "PUT";
    const body = mode === "create" ? payload : { courseId, ...payload };

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      alert(`${mode === "create" ? "Create" : "Update"} failed`);
      return;
    }
    router.push("/courses");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    if (!courseId) return;
    const res = await fetch("/api/courses", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    router.push("/courses");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Channel</label>
          <Select
            options={channelOptions}
            value={selectedChannel}
            onChange={(opt) => setSelectedChannel(opt as Option)}
            placeholder="Select a channel..."
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Level</label>
          <Select
            options={levelOptions}
            value={selectedLevel}
            onChange={(opt) => setSelectedLevel(opt as Option)}
            placeholder="Select a level..."
          />
        </div>
      </div>

      <div className="space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          {mode === "create" ? "Create Course" : "Save Changes"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={handleDelete}
          >
            Delete Course
          </button>
        )}
      </div>
    </form>
  );
}
