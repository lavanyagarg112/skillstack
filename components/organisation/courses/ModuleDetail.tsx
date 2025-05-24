"use client";

import React from "react";

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
  file_url?: string;
  quiz?: {
    title: string;
    questions: QuizQuestion[];
  };
}

interface Props {
  data: ModuleDetailData;
}

export default function ModuleDetail({ data }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-purple-600">{data.title}</h2>

      {data.module_type === "video" && data.file_url && (
        <video controls src={data.file_url} className="w-full rounded-lg" />
      )}

      {["pdf", "slide"].includes(data.module_type) && data.file_url && (
        <iframe
          src={data.file_url}
          className="w-full h-[600px] rounded-lg border"
        />
      )}

      {data.module_type === "quiz" && data.quiz && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">{data.quiz.title}</h3>
          {data.quiz.questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <p className="font-medium">{q.question_text}</p>
              {q.options?.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    disabled
                    className="border-gray-300"
                  />
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
