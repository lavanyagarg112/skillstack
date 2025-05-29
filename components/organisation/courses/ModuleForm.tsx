"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModuleDetailData } from "./ModuleDetail";
interface Props {
  mode: "create" | "edit";
  courseId: string;
}

export default function ModuleForm({ mode, courseId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();
  const [moduleType, setModuleType] =
    useState<ModuleDetailData["module_type"]>("pdf");

  useEffect(() => {
    // fetch module details
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      const fd = new FormData();
      fd.append("courseId", courseId);
      fd.append("name", name);
      fd.append("description", description);
      fd.append("type", moduleType);
      if (uploadFile) {
        fd.append("file", uploadFile);
      }
      try {
        const res = await fetch("/api/courses/add-module", {
          method: "POST",
          credentials: "include",
          body: fd,
        });

        if (!res.ok) throw new Error("Failed to upload module");

        const data = await res.json();
        console.log("Module created:", data);
        router.push(`/courses/${courseId}/modules/${data.module_id}`);
      } catch (err) {
        console.error(err);
        alert("Could not create module. Please try again.");
      }
    } else router.push("/courses");
    // module endpoints - new or delete or edit
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
          className="w-full mt-1 p-2 border rounded"
          rows={4}
        />
      </div>
      <div>
        <label className="block text-gray-700">Material Type</label>
        <select
          value={moduleType}
          onChange={(e) => setModuleType(e.target.value as any)}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="video">Video</option>
          <option value="pdf">PDF</option>
          <option value="slide">Slide</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Upload Material</label>{" "}
        <input
          key={moduleType}
          type="file"
          accept={
            moduleType === "video"
              ? "video/*"
              : moduleType === "pdf"
              ? "application/pdf"
              : moduleType === "slide"
              ? ".ppt,.pptx,application/pdf"
              : undefined
          }
          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
          required={mode === "create"}
          className="
      block w-full 
      mt-1 p-3 
      text-gray-600 bg-white 
      border-2 border-dashed border-gray-300 
      rounded-lg 
      cursor-pointer 
      hover:border-purple-600

      /* style the “Choose file” button: */
      file:mr-4 
      file:py-2 file:px-4 
      file:rounded 
      file:border-0 
      file:bg-purple-600 
      file:text-white 
      file:font-semibold 
      hover:file:bg-purple-700
    "
        />
      </div>
      <div className="space-x-4">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          {mode === "create" ? "Create Module" : "Save Changes"}
        </button>
        {mode === "edit" && (
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={(e) => {
              setDeleteMode(true);
            }}
          >
            Delete Module
          </button>
        )}
      </div>
    </form>
  );
}
