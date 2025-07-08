// components/organisation/courses/CourseForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

export interface Course {
  id: number;
  name: string;
  description?: string;
  tags?: { id: number; name: string }[];
}
interface Tag {
  id: number;
  name: string;
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
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses/tags", { credentials: "include" })
      .then((r) => r.json())
      .then((tags: Tag[]) => {
        setAllTags(tags);
        setOptions(tags.map((t) => ({ value: t.id, label: t.name })));
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
          const pre = (course.tags || []).map((t) => ({
            value: t.id,
            label: t.name,
          }));
          setSelected(pre);
        })
        .catch((_) => {
          alert("Failed to load course");
          router.push("/courses");
        });
    }
  }, [mode, courseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = selected.map((o) => o.value);
    const payload = {
      courseName: name,
      description,
      tags,
      updateTags: mode === "edit",
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

      <div>
        <label className="block text-gray-700 mb-1">Tags</label>
        <Select
          isMulti
          options={options}
          value={selected}
          onChange={(opts) => setSelected(opts as Option[])}
        />
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
