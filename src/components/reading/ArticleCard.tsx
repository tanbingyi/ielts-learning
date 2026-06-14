import Link from "next/link";
import type { ArticleSummary } from "@/types";

const difficultyLabels: Record<string, string> = {
  A2: "初级",
  B1: "中级",
  B2: "中高级",
  C1: "高级",
};

const difficultyColors: Record<string, string> = {
  A2: "bg-green-100 text-green-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-yellow-100 text-yellow-700",
  C1: "bg-red-100 text-red-700",
};

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link
      href={`/reading/${article.id}`}
      className="block bg-white border border-mint-200 rounded-xl p-5 hover:shadow-md hover:border-mint-400 transition-all no-underline"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-800 text-base leading-snug flex-1">
          {article.title}
        </h3>
        <div className="flex gap-1.5 shrink-0">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[article.difficulty] || "bg-gray-100 text-gray-600"}`}
          >
            {difficultyLabels[article.difficulty] || article.difficulty}
          </span>
          {article.completed && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-mint-100 text-mint-700">
              已完成
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-3">{article.titleCn}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{article.questionCount} 道练习题</span>
        {article.score !== null && article.score !== undefined && (
          <span className="font-medium text-mint-600">得分: {article.score}%</span>
        )}
      </div>
    </Link>
  );
}
