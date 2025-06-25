"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useState } from "react";

export interface QuizOption {
  id: number;
  option_text: string;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  options: QuizOption[];
}

export interface ModuleDetailData {
  id: number;
  title: string;
  module_type: "video" | "pdf" | "slide" | "quiz" | string;
  description?: string;
  file_url?: string;
  quiz?: {
    id: number;
    title: string;
    questions: QuizQuestion[];
  };
}

interface Props {
  moduleId: string;
  isAdmin: boolean;
}

export default function ModuleDetail({ moduleId, isAdmin }: Props) {
  const [data, setData] = React.useState<ModuleDetailData | null>(null);
  const [enrolled, setEnrolled] = React.useState<boolean>(false);
  const { courseId } = useParams() as { courseId: string };
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [moduleStatus, setModuleStatus] = useState<string | null>(null);
  const [courseCompleted, setCourseCompleted] = useState<boolean>(false);

  const [results, setResults] = useState<
    | {
        questionId: number;
        correctOptions: { id: number; text: string }[];
        selectedOptions: { id: number; text: string }[];
        isCorrect: boolean;
      }[]
    | null
  >(null);

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
        if (result.module_type === "quiz" && result.quiz) {
          getQuizResults(result.quiz.id);
        }
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
          body: JSON.stringify({ courseId: courseId }),
        });
        if (!response.ok) {
          throw new Error("Failed to check enrollment");
        }
        const data = await response.json();
        setEnrolled(data.enrolled);
        if (data.enrolled && !isAdmin) {
          checkModuleStatus();
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
        setEnrolled(false);
      }
    }

    async function checkModuleStatus() {
      try {
        const response = await fetch(`/api/courses/get-module-status`, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moduleId: moduleId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch module status");
        }
        const data = await response.json();
        setModuleStatus(data.status || null);
        setCourseCompleted(data.isCourseCompleted || false);
      } catch (error) {
        console.error("Error fetching module status:", error);
        setModuleStatus(null);
        setCourseCompleted(false);
      }
    }

    async function getQuizResults(quizId: number) {
      try {
        const { responseId, results } = await fetch(
          "/api/courses/get-latest-quiz-response",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizId: quizId }),
          }
        ).then((r) => r.json());

        if (responseId && results) {
          setResults(results);
        }
      } catch (err) {
        console.error("Could not fetch or grade quiz:", err);
      }
    }
    checkEnrollmentInCourse();
    fetchModuleDetails();
  }, [moduleId]);

  if (!data) {
    return <p className="text-gray-600">Loading module details...</p>;
  }

  if (!enrolled) {
    return (
      <p className="text-red-600">
        You must be enrolled in the course to view this module.
      </p>
    );
  }

  if (
    data.module_type !== "video" &&
    data.module_type !== "pdf" &&
    data.module_type !== "slide" &&
    data.module_type !== "quiz"
  ) {
    return (
      <p className="text-gray-600">
        No preview available for this module type: {data.module_type}.
      </p>
    );
  }

  if (data.module_type !== "quiz") {
    const finalUrl = `http://localhost:4000${data.file_url}`;
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          {moduleStatus === "not_started" && !courseCompleted && (
            <button
              onClick={async () => {
                await fetch("/api/courses/mark-module-started", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ moduleId: data.id }),
                });
                alert("Module started!");
                setModuleStatus("in_progress");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Start Module
            </button>
          )}

          {moduleStatus === "in_progress" && !courseCompleted && (
            <button
              onClick={async () => {
                await fetch("/api/courses/mark-module-completed", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ moduleId: data.id }),
                });
                alert("Module completed!");
                setModuleStatus("completed");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Mark as Completed
            </button>
          )}

          {moduleStatus === "completed" && !courseCompleted && (
            <button
              onClick={async () => {
                await fetch("/api/courses/mark-module-started", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ moduleId: data.id }),
                });
                alert("Module restarted!");
                setModuleStatus("in_progress");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Module has been completed. Reset Module Progress
            </button>
          )}
        </div>
        <h2 className="text-3xl font-bold text-purple-600">{data.title}</h2>
        <p>{data.description}</p>

        {data.module_type === "video" && data.file_url && (
          <video controls src={finalUrl} className="w-full rounded-lg" />
        )}

        {["pdf", "slide"].includes(data.module_type) && data.file_url && (
          <iframe
            src={finalUrl}
            className="w-full h-[600px] rounded-lg border"
          />
        )}
      </div>
    );
  }

  const { quiz } = data;

  const handleChange = (qId: number, optId: number, multiple: boolean) => {
    setAnswers((ans) => {
      if (multiple) {
        const prev = Array.isArray(ans[qId]) ? (ans[qId] as number[]) : [];
        if (prev.includes(optId)) {
          return { ...ans, [qId]: prev.filter((x) => x !== optId) };
        } else {
          return { ...ans, [qId]: [...prev, optId] };
        }
      } else {
        return { ...ans, [qId]: optId };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdmin || courseCompleted) {
      return;
    }

    const missing = quiz!.questions
      .filter((q) => q.question_type === "multiple_choice")
      .filter((q) => {
        const sel = answers[q.id];
        return !Array.isArray(sel) || sel.length === 0;
      });

    if (missing.length > 0) {
      alert(
        "Please select at least one option for:\n" +
          missing.map((q) => `• ${q.question_text}`).join("\n")
      );
      return;
    }

    const payload = {
      quizId: quiz?.id,
      answers: Object.entries(answers).map(([qId, sel]) => ({
        questionId: Number(qId),

        selectedOptionIds: Array.isArray(sel) ? sel : [sel],
      })),
    };
    try {
      const res = await fetch("/api/courses/submit-and-grade-quiz", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submit failed");
      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz.");
    }
  };

  const handleRetake = () => {
    setResults(null);
    setAnswers({});
  };

  if (data.module_type === "quiz" && results) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">{data.title} — Results</h2>
        {results.map((r) => (
          <div key={r.questionId} className="p-4 border rounded space-y-2">
            <p className="font-medium">Question {r.questionId}</p>
            <p>
              Your answers:&nbsp;
              {r.selectedOptions.map((o) => o.text).join(", ")}
            </p>
            <p>
              Correct:&nbsp;
              {r.correctOptions.map((o) => o.text).join(", ")}
            </p>
            <p>
              {r.isCorrect ? (
                <span className="text-green-600">Correct</span>
              ) : (
                <span className="text-red-600">Incorrect</span>
              )}
            </p>
          </div>
        ))}
        {!courseCompleted && (
          <button
            onClick={handleRetake}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold">{data.title}</h2>
      {!courseCompleted && (
        <p className="text-red-600">
          Please note that if you leave this page without submitting, your
          answers will be lost
        </p>
      )}
      {quiz?.questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">{q.question_text}</p>
          {q.options.map((opt) => (
            <label key={opt.id} className="flex items-center space-x-2">
              <input
                type={q.question_type === "true_false" ? "radio" : "checkbox"}
                name={`q-${q.id}`}
                value={opt.id}
                checked={
                  q.question_type === "true_false"
                    ? answers[q.id] === opt.id
                    : Array.isArray(answers[q.id]) &&
                      (answers[q.id] as number[]).includes(opt.id)
                }
                onChange={() =>
                  handleChange(q.id, opt.id, q.question_type !== "true_false")
                }
                className="border-gray-300"
                required={q.question_type === "true_false"}
                disabled={isAdmin || courseCompleted}
              />
              <span>{opt.option_text}</span>
            </label>
          ))}
        </div>
      ))}
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Submit Quiz
      </button>
    </form>
  );
}
