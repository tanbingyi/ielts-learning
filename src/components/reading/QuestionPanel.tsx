"use client";

import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/types";

interface Props {
  questions: Question[];
  initialAnswers?: Record<string, string>;
  onSave?: (answers: Record<string, string>) => void;
  onSubmit: (answers: Record<string, string>) => void;
}

export default function QuestionPanel({ questions, initialAnswers, onSave, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers || {});
  const [submitted, setSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Restore initial answers when they change
  useEffect(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  const handleSelect = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      // Auto-save after each selection
      if (onSave) {
        onSave(next);
        setLastSaved(new Date().toLocaleTimeString());
      }
      return next;
    });
  }, [onSave]);

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    onSubmit(answers);
  };

  return (
    <div className="border border-mint-200 rounded-xl bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800 text-lg">
          阅读理解题 ({questions.length} 题)
        </h3>
        {lastSaved && (
          <span className="text-xs text-gray-400">
            已自动保存 {lastSaved}
          </span>
        )}
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id}>
            <p className="font-medium text-gray-700 mb-3">
              <span className="text-mint-500 mr-1.5">{idx + 1}.</span>
              {q.questionText}
              <span className="ml-1.5 text-xs text-mint-500 font-normal">
                ({q.type === "multiple_choice" ? "单选题" : "判断题"})
              </span>
            </p>
            <div className="space-y-2 ml-5">
              {q.options.map((opt) => {
                const value = q.type === "true_false"
                  ? opt === "True" ? "True" : "False"
                  : opt.charAt(0);
                const label = q.type === "true_false"
                  ? opt === "True" ? "正确 (True)" : "错误 (False)"
                  : opt;

                return (
                  <label
                    key={value}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                      answers[q.id] === value
                        ? "border-mint-500 bg-mint-50 text-mint-800"
                        : "border-gray-200 hover:border-mint-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={value}
                      checked={answers[q.id] === value}
                      onChange={() => handleSelect(q.id, value)}
                      disabled={submitted}
                      className="accent-mint-500"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitted}
          className="bg-mint-500 hover:bg-mint-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-8 py-2.5 text-sm font-medium transition-colors cursor-pointer"
        >
          {submitted ? "已提交" : "提交答案"}
        </button>
        {!allAnswered && !submitted && (
          <p className="text-xs text-gray-400 mt-2">
            请回答所有题目后再提交（已选 {Object.keys(answers).filter(k => answers[k]).length}/{questions.length} 题）
          </p>
        )}
      </div>
    </div>
  );
}
