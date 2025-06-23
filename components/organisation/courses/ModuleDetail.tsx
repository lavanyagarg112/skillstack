"use client";

import React, { useEffect } from "react";

export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: string;
  options?: { id: number; option_text: string }[];
}

export interface ModuleDetailData {
  id: number;
  title: string;
  module_type: "video" | "pdf" | "slide" | "quiz" | string;
  description?: string;
  file_url?: string;
  quiz?: {
    title: string;
    questions: QuizQuestion[];
  };
}

interface Props {
  moduleId: string;
}

export default function ModuleDetail({ moduleId }: Props) {
  const [data, setData] = React.useState<ModuleDetailData | null>(null);
  const [endrolled, setEnrolled] = React.useState<boolean>(false);

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
        setData(result);
      } catch (error) {
        console.error("Error fetching module details:", error);
        setData(null);
      }
    }
    async function checkEnrollmentInCourse() {
      try {
        const response = await fetch(`/api/courses/is-enrolled`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId: moduleId }),
        });
        if (!response.ok) {
          throw new Error("Failed to check enrollment");
        }
        const data = await response.json();
        setEnrolled(data.enrolled);
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setEnrolled(false);
      }
    }
    checkEnrollmentInCourse();
    fetchModuleDetails();
  }, [moduleId]);

  if (!data) {
    return <p className="text-gray-600">Loading module details...</p>;
  }

  if (!endrolled) {
    return (
      <p className="text-red-600">
        You must be enrolled in the course to view this module.
      </p>
    );
  }

  const finalUrl = `http://localhost:4000${data.file_url}`;
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-600">{data.title}</h2>
      <p>{data.description}</p>

      {data.module_type === "video" && data.file_url && (
        <video controls src={finalUrl} className="w-full rounded-lg" />
      )}

      {["pdf", "slide"].includes(data.module_type) && data.file_url && (
        <iframe src={finalUrl} className="w-full h-[600px] rounded-lg border" />
      )}

      {data.module_type === "quiz" && data.quiz && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">{data.quiz.title}</h3>
          {data.quiz.questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="font-medium">{q.question_text}</p>
              {q.options?.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  {q.question_type === "multiple_choice" && (
                    <input
                      type="checkbox"
                      name={`q-${q.id}`}
                      disabled
                      className="border-gray-300"
                    />
                  )}
                  {q.question_type === "true_false" && (
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      disabled
                      className="border-gray-300"
                    />
                  )}
                  <label>{opt.option_text}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {!["video", "pdf", "slide", "quiz"].includes(data.module_type) && (
        <p className="text-gray-600">No preview available for this module.</p>
      )}
    </div>
  );
}
