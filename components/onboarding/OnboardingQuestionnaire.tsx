"use client";

import { useState, useEffect } from "react";

interface Tag {
  id: number;
  name: string;
}

interface Option {
  id: number;
  option_text: string;
  tag_id: number | null;
  tag_name: string | null;
}

interface Question {
  id: number;
  question_text: string;
  position: number;
  options: Option[];
}

interface OnboardingQuestionnaireProps {
  onComplete: (responses: number[]) => void;
  loading: boolean;
}

export default function OnboardingQuestionnaire({
  onComplete,
  loading,
}: OnboardingQuestionnaireProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Set<number>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/onboarding/questions", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      } else {
        setError("Failed to load questions");
      }
    } catch (err) {
      setError("Error loading questions");
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleOptionSelect = (optionId: number) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const handleSubmit = () => {
    if (selectedOptions.size === 0) {
      setError("Please select at least one option");
      return;
    }
    onComplete(Array.from(selectedOptions));
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-6">
            Your organization hasn't set up any onboarding questions yet.
          </p>
          <button
            onClick={() => onComplete([])}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Skills Assessment</h1>
        <p className="text-gray-600 mb-4">
          Help us understand your background and experience level.
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-medium mb-6">{currentQ.question_text}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedOptions.has(option.id)}
                onChange={() => handleOptionSelect(option.id)}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <span className="text-gray-900">{option.option_text}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion
                  ? "bg-purple-600"
                  : index < currentQuestion
                  ? "bg-purple-300"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={loading || selectedOptions.size === 0}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Complete Assessment"}
          </button>
        ) : (
          <button
            onClick={goToNext}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
