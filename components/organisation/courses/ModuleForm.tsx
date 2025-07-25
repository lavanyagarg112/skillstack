"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModuleDetailData } from "./ModuleDetail";
import Select from "react-select";

interface Skill {
  id: number;
  name: string;
  description?: string;
}
interface Option {
  value: number;
  label: string;
}
interface Props {
  mode: "create" | "edit";
  courseId: string;
  moduleId?: string;
}

interface Question {
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  options: { option_text: string; is_correct: boolean }[];
}

export default function ModuleForm({ mode, courseId, moduleId }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const router = useRouter();
  const [moduleType, setModuleType] =
    useState<ModuleDetailData["module_type"]>("pdf");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<Option[]>([]);
  useEffect(() => {
    fetch("/api/courses/skills", { credentials: "include" })
      .then((r) => r.json())
      .then((skills: Skill[]) => {
        setAllSkills(skills);
        setOptions(skills.map((s) => ({ value: s.id, label: s.name })));
      })
      .catch(console.error);
    if (mode === "edit" && moduleId) {
      fetch("/api/courses/get-module", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then((mod: ModuleDetailData & { skills?: Skill[] }) => {
          setName(mod.title);
          setDescription(mod.description);
          setModuleType(mod.module_type);
          setSelected(
            (mod.skills || []).map((s) => ({ value: s.id, label: s.name }))
          );
        })
        .catch(() => {
          alert("Failed to load module");
          router.push(`/courses/${courseId}`);
        });
    }
  }, [mode, moduleId, courseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create") {
      const fd = new FormData();
      fd.append("courseId", courseId);
      fd.append("name", name);
      fd.append("description", description);
      fd.append("type", moduleType);
      if (moduleType === "quiz") {
        if (questions.length === 0) {
          alert("Please add at least one question.");
          return;
        }
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.question_text.trim()) {
            alert(`Question ${i + 1} is empty. Please enter question text.`);
            return;
          }
          if (q.question_type === "multiple_choice") {
            if (q.options.length === 0) {
              alert(`Question ${i + 1} must have at least one option.`);
              return;
            }
            if (q.options.some((opt) => !opt.option_text.trim())) {
              alert(`All options for question ${i + 1} must have text.`);
              return;
            }
            if (!q.options.some((opt) => opt.is_correct)) {
              alert(
                `Please mark at least one correct answer for question ${i + 1}.`
              );
              return;
            }
          } else if (q.question_type === "true_false") {
            const correctCount = q.options.filter(
              (opt) => opt.is_correct
            ).length;
            if (correctCount !== 1) {
              alert(
                `Please mark the correct answer for question ${
                  i + 1
                } as either True or False.`
              );
              return;
            }
          }
        }
        fd.append("questions", JSON.stringify(questions));
      } else if (uploadFile) {
        fd.append("file", uploadFile);
      }
      const skillsPayload = selected.map((opt) => ({
        id: typeof opt.value === "number" ? opt.value : undefined,
        name: typeof opt.value === "string" ? opt.value : undefined,
        isNew: typeof opt.value === "string",
      }));
      fd.append("moduleSkills", JSON.stringify(skillsPayload));
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
    } else {
      const fd = new FormData();
      fd.append("moduleId", moduleId || "");
      fd.append("name", name);
      fd.append("description", description);
      if (moduleType === "quiz" && questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.question_text.trim()) {
            alert(`Question ${i + 1} is empty. Please enter question text.`);
            return;
          }
          if (q.question_type === "multiple_choice") {
            if (q.options.length === 0) {
              alert(`Question ${i + 1} must have at least one option.`);
              return;
            }
            if (q.options.some((opt) => !opt.option_text.trim())) {
              alert(`All options for question ${i + 1} must have text.`);
              return;
            }
            if (!q.options.some((opt) => opt.is_correct)) {
              alert(
                `Please mark at least one correct answer for question ${i + 1}.`
              );
              return;
            }
          } else if (q.question_type === "true_false") {
            const correctCount = q.options.filter(
              (opt) => opt.is_correct
            ).length;
            if (correctCount !== 1) {
              alert(
                `Please mark the correct answer for question ${
                  i + 1
                } as either True or False.`
              );
              return;
            }
          }
        }
        fd.append("type", moduleType);
        fd.append("questions", JSON.stringify(questions));
      } else if (uploadFile) {
        fd.append("type", moduleType);
        fd.append("file", uploadFile);
      }
      const skillsPayload = selected.map((opt) => ({
        id: typeof opt.value === "number" ? opt.value : undefined,
        name: typeof opt.value === "string" ? opt.value : undefined,
        isNew: typeof opt.value === "string",
      }));
      fd.append("moduleSkills", JSON.stringify(skillsPayload));
      fd.append("updateSkills", "true");
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

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

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
      {moduleType === "quiz" ? (
        <div>
          <h3 className="text-gray-700">Quiz Questions</h3>
          {questions.map((q, qi) => (
            <div key={qi} className="mb-4 p-4 border rounded">
              <input
                type="text"
                placeholder={`Question ${qi + 1}`}
                value={q.question_text}
                onChange={(e) => {
                  const qs = [...questions];
                  qs[qi].question_text = e.target.value;
                  setQuestions(qs);
                }}
                className="w-full mb-2 p-2 border rounded"
              />
              <select
                value={q.question_type}
                onChange={(e) => {
                  const qs = [...questions];
                  qs[qi].question_type = e.target.value as any;
                  setQuestions(qs);
                }}
                className="mb-2 p-2 border rounded"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True / False</option>
              </select>
              {q.question_type === "true_false" ? (
                <div className="flex space-x-6 mb-2">
                  {["True", "False"].map((label) => (
                    <label key={label} className="flex items-center space-x-1">
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={
                          !!q.options.find(
                            (opt) => opt.option_text === label && opt.is_correct
                          )
                        }
                        onChange={() => {
                          const qs = [...questions];
                          qs[qi].options = [
                            {
                              option_text: "True",
                              is_correct: label === "True",
                            },
                            {
                              option_text: "False",
                              is_correct: label === "False",
                            },
                          ];
                          setQuestions(qs);
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center space-x-2 mb-1">
                      <input
                        type="text"
                        placeholder={`Option ${oi + 1}`}
                        value={opt.option_text}
                        onChange={(e) => {
                          const qs = [...questions];
                          qs[qi].options[oi].option_text = e.target.value;
                          setQuestions(qs);
                        }}
                        className="flex-1 p-2 border rounded"
                      />
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={opt.is_correct}
                          onChange={(e) => {
                            const qs = [...questions];
                            qs[qi].options[oi].is_correct = e.target.checked;
                            setQuestions(qs);
                          }}
                        />
                        <span>Correct</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const qs = [...questions];
                          qs[qi].options.splice(oi, 1);
                          setQuestions(qs);
                        }}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const qs = [...questions];
                      qs[qi].options.push({
                        option_text: "",
                        is_correct: false,
                      });
                      setQuestions(qs);
                    }}
                    className="text-purple-600"
                  >
                    + Add Option
                  </button>
                </>
              )}
              <hr className="my-2" />
              <button
                type="button"
                onClick={() => {
                  const qs = [...questions];
                  qs.splice(qi, 1);
                  setQuestions(qs);
                }}
                className="text-red-600"
              >
                Remove Question
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setQuestions([
                ...questions,
                {
                  question_text: "",
                  question_type: "multiple_choice",
                  options: [{ option_text: "", is_correct: false }],
                },
              ])
            }
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add Question
          </button>
        </div>
      ) : (
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
      )}
      <div>
        <label className="block text-gray-700 mb-1">Skills</label>
        <Select
          isMulti
          options={options}
          value={selected}
          onChange={(opts) => setSelected(opts as Option[])}
          placeholder="Select skills..."
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
              handleDelete(e);
            }}
          >
            Delete Module
          </button>
        )}
      </div>
    </form>
  );
}
