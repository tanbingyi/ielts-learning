"use client";

import { useState, useEffect, useCallback } from "react";
import type { Question } from "@/types";

interface Props {
  questions: Question[];
  initialAnswers?: Record<string, string>;
  onSave?: (answers: Record<string, string>) => void;
  onSubmit: (answers: Record<string, string>) => void;
}

function getTypeLabel(type: Question["type"]): string {
  switch (type) {
    case "multiple_choice": return "单选题";
    case "true_false": return "判断题";
    case "true_false_not_given": return "判断题 (T/F/NG)";
    case "yes_no_not_given": return "判断题 (Y/N/NG)";
    case "note_completion": return "填空题";
  }
}

export default function QuestionPanel({ questions, initialAnswers, onSave, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers || {});
  const [submitted, setSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  const handleSelect = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      if (onSave) {
        onSave(next);
        setLastSaved(new Date().toLocaleTimeString());
      }
      return next;
    });
  }, [onSave]);

  const allAnswered = questions.every((q) => answers[q.id]);
  const answeredCount = Object.keys(answers).filter((k) => answers[k]).length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    onSubmit(answers);
  };

  const renderOptions = (q: Question) => {
    const isTextInput = q.type === "note_completion";
    const isTFNG = q.type === "true_false_not_given";
    const isYNNG = q.type === "yes_no_not_given";

    if (isTextInput) {
      return (
        <input
          type="text"
          value={answers[q.id] || ""}
          onChange={(e) => handleSelect(q.id, e.target.value.trim().toLowerCase())}
          disabled={submitted}
          placeholder="填入一个单词"
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent w-full max-w-[200px] disabled:bg-gray-50"
        />
      );
    }

    if (isTFNG) {
      const opts = ["True", "False", "Not Given"];
      return opts.map((opt) => {
        const value = opt === "True" ? "True" : opt === "False" ? "False" : "Not Given";
        const label = opt === "True" ? "正确 (True)" : opt === "False" ? "错误 (False)" : "未提及 (Not Given)";
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
      });
    }

    if (isYNNG) {
      const opts = ["Yes", "No", "Not Given"];
      return opts.map((opt) => ({
        value: opt === "Yes" ? "Yes" : opt === "No" ? "No" : "Not Given",
        label: opt === "Yes" ? "是 (Yes)" : opt === "No" ? "否 (No)" : "未提及 (Not Given)",
      })).map(({ value, label }) => (
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
      ));
    }

    // multiple_choice or true_false
    return q.options.map((opt) => {
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
    });
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
                ({getTypeLabel(q.type)})
              </span>
            </p>
            <div className="space-y-2 ml-5">
              {renderOptions(q)}
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
            请回答所有题目后再提交（已选 {answeredCount}/{questions.length} 题）
          </p>
        )}
      </div>
    </div>
  );
}
