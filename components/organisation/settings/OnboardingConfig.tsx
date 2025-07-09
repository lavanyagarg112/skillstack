"use client";

import { useState, useEffect } from "react";

interface Skill {
  id: number;
  name: string;
  description?: string;
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
  sort_order: number;
}

interface Option {
  id: number;
  option_text: string;
  skill_id: number | null;
  skill_name: string | null;
  skill_description: string | null;
  channel_id: number | null;
  channel_name: string | null;
  level_id: number | null;
  level_name: string | null;
}

interface Question {
  id: number;
  question_text: string;
  position: number;
  options: Option[];
}

export default function OnboardingConfig() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [newOptionText, setNewOptionText] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/onboarding/questions", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      } else {
        setError("Failed to fetch questions");
      }
    } catch (err) {
      setError("Error fetching questions");
      console.error(err);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/courses/skills", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSkills(data || []);
      } else {
        setError("Failed to fetch skills");
      }
    } catch (err) {
      setError("Error fetching skills");
      console.error(err);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/courses/channels", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setChannels(data || []);
      } else {
        setError("Failed to fetch channels");
      }
    } catch (err) {
      setError("Error fetching channels");
      console.error(err);
    }
  };

  const fetchLevels = async () => {
    try {
      const res = await fetch("/api/courses/levels", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setLevels(data || []);
      } else {
        setError("Failed to fetch levels");
      }
    } catch (err) {
      setError("Error fetching levels");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchSkills();
    fetchChannels();
    fetchLevels();
  }, []);

  const addQuestion = async () => {
    const text = newQuestionText.trim();
    if (!text) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/questions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: text,
          position: questions.length,
        }),
      });

      if (res.ok) {
        setNewQuestionText("");
        await fetchQuestions();
      } else {
        setError("Failed to add question");
      }
    } catch (err) {
      setError("Error adding question");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: number) => {
    if (
      !confirm(
        "Delete this question? All associated options will also be deleted."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/onboarding/questions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await fetchQuestions();
      } else {
        setError("Failed to delete question");
      }
    } catch (err) {
      setError("Error deleting question");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addOption = async (questionId: number) => {
    const text = newOptionText.trim();
    if (!text) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/onboarding/questions/${questionId}/options`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            option_text: text,
            ...(selectedSkillId && { skill_id: selectedSkillId }),
            ...(selectedChannelId && { channel_id: selectedChannelId }),
            ...(selectedLevelId && { level_id: selectedLevelId }),
          }),
        }
      );

      if (res.ok) {
        setNewOptionText("");
        setSelectedSkillId(null);
        setSelectedChannelId(null);
        setSelectedLevelId(null);
        setEditingQuestion(null);
        await fetchQuestions();
      } else {
        setError("Failed to add option");
      }
    } catch (err) {
      setError("Error adding option");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteOption = async (optionId: number, questionId: number) => {
    if (!confirm("Delete this option?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/onboarding/options/${optionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await fetchQuestions();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to delete option");
      }
    } catch (err) {
      setError("Error deleting option");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Onboarding Form Configuration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow border">
        <h2 className="text-lg font-semibold mb-4">Add New Question</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter question text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addQuestion();
              }
            }}
            className="flex-1 p-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />
          <button
            onClick={addQuestion}
            disabled={loading || !newQuestionText.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Question"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-white p-4 rounded-lg shadow border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{question.question_text}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEditingQuestion(
                      editingQuestion === question.id ? null : question.id
                    )
                  }
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  {editingQuestion === question.id ? "Cancel" : "Add Option"}
                </button>
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>

            {question.options.length > 0 ? (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Options:</h4>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center flex-1">
                        <span>{option.option_text}</span>
                        <div className="flex gap-1 ml-2">
                          {option.skill_name && (
                            <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                              {option.skill_name}
                            </span>
                          )}
                          {option.channel_name && (
                            <span className="inline-flex items-center bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                              {option.channel_name}
                            </span>
                          )}
                          {option.level_name && (
                            <span className="inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                              {option.level_name}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteOption(option.id, question.id)}
                        disabled={loading || question.options.length <= 1}
                        className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          question.options.length <= 1
                            ? "Cannot delete the last option"
                            : "Delete option"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p className="text-sm">
                  ⚠️ This question has no options yet. Add at least one option
                  to make it available to employees.
                </p>
              </div>
            )}

            {editingQuestion === question.id && (
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-medium mb-3">Add New Option</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Option text"
                    value={newOptionText}
                    onChange={(e) => setNewOptionText(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring"
                    disabled={loading}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                      value={selectedSkillId || ""}
                      onChange={(e) =>
                        setSelectedSkillId(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="p-2 border rounded focus:outline-none focus:ring"
                      disabled={loading}
                    >
                      <option value="">No skill (optional)</option>
                      {skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedChannelId || ""}
                      onChange={(e) =>
                        setSelectedChannelId(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="p-2 border rounded focus:outline-none focus:ring"
                      disabled={loading}
                    >
                      <option value="">No channel (optional)</option>
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          {channel.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedLevelId || ""}
                      onChange={(e) =>
                        setSelectedLevelId(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className="p-2 border rounded focus:outline-none focus:ring"
                      disabled={loading}
                    >
                      <option value="">No level (optional)</option>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => addOption(question.id)}
                    disabled={loading || !newOptionText.trim()}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Option"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {questions.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No questions configured yet. Add your first question above.
        </div>
      )}
    </div>
  );
}
