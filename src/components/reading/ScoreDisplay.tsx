"use client";

import type { Question, SubmitResult } from "@/types";

interface Props {
  result: SubmitResult;
  questions: Question[];
  onRetry: () => void;
}

export default function ScoreDisplay({ result, questions, onRetry }: Props) {
  const percentage = result.score;
  const colorClass =
    percentage >= 80
      ? "text-green-500"
      : percentage >= 60
        ? "text-yellow-500"
        : "text-red-500";

  const strokeColor =
    percentage >= 80
      ? "#22c55e"
      : percentage >= 60
        ? "#eab308"
        : "#ef4444";

  return (
    <div className="border border-mint-200 rounded-xl bg-white p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center relative mb-3">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              className="transition-all duration-700"
            />
          </svg>
          <span className={`absolute text-2xl font-bold ${colorClass}`}>
            {percentage}%
          </span>
        </div>
        <p className="text-sm text-gray-500">
          答对 {result.results.filter((r) => r.isCorrect).length}/{result.total} 题
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => {
          const r = result.results.find((r) => r.questionId === q.id);
          if (!r) return null;

          return (
            <div
              key={q.id}
              className={`border rounded-lg p-3 text-sm ${
                r.isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="font-medium shrink-0 mt-0.5">
                  {idx + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-gray-700 mb-1">{q.questionText}</p>
                  <div className="flex gap-4 text-xs">
                    <span>
                      你的答案:{" "}
                      <span className={r.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {r.userAnswer || "未作答"}
                      </span>
                    </span>
                    {!r.isCorrect && (
                      <span>
                        正确答案:{" "}
                        <span className="text-green-600 font-medium">
                          {r.correctAnswer}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-lg">
                  {r.isCorrect ? "✓" : "✗"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onRetry}
          className="bg-mint-500 hover:bg-mint-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors cursor-pointer"
        >
          重新答题
        </button>
      </div>
    </div>
  );
}
