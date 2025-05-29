"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModuleDetailData } from "./ModuleDetail";
interface Props {
  mode: "create" | "edit";
  courseId: string;
  moduleId?: string;
}

export default function ModuleForm({ mode, courseId, moduleId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const router = useRouter();
  const [moduleType, setModuleType] =
    useState<ModuleDetailData["module_type"]>("pdf");

  useEffect(() => {
    async function fetchModuleDetails() {
      try {
        const response = await fetch(`/api/courses/get-module`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moduleId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch module details");
        }
        const result = await response.json();
        setName(result.title);
        setDescription(result.description);
        setModuleType(result.module_type);
      } catch (error) {
        console.error("Error fetching module details:", error);
        setName("");
        setDescription("");
        setModuleType("pdf");
      }
    }

    if (mode === "edit" && moduleId) {
      fetchModuleDetails();
    }
  }, [moduleId]);

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
    } else if (deleteMode) {
      if (!confirm("Are you sure you want to delete this module?")) return;

      try {
        const response = await fetch("/api/courses/delete-module", {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moduleId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete module");
        }

        router.push(`/courses`);
      } catch (error) {
        console.error("Error deleting module:", error);
        alert("Failed to delete module. Please try again.");
      }
    } else {
      const fd = new FormData();
      fd.append("moduleId", moduleId || "");
      fd.append("name", name);
      fd.append("description", description);
      if (uploadFile) {
        fd.append("type", moduleType);
        fd.append("file", uploadFile);
      }
      try {
        const res = await fetch("/api/courses/update-module", {
          method: "PUT",
          credentials: "include",
          body: fd,
        });

        if (!res.ok) throw new Error("Failed to update module");

        const data = await res.json();
        console.log("Module updated:", data);
        router.push(`/courses/${courseId}/modules/${moduleId}`);
      } catch (err) {
        console.error(err);
        alert("Could not update module. Please try again.");
      }
    }
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
        {mode === "edit" && (
          <p className="mb-4 text-sm text-red-500">
            <strong>Note:</strong> If you upload a new file, the existing file
            will be replaced with the new one. If you don't upload a new file,
            the existing file and file type will remain unchanged.
          </p>
        )}
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
