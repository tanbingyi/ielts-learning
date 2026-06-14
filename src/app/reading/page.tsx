import { cookies } from "next/headers";
import ArticleCard from "@/components/reading/ArticleCard";
import type { ArticleSummary } from "@/types";

async function getArticles(): Promise<ArticleSummary[]> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${getBaseUrl()}/api/articles`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.articles;
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "http://localhost:3000";
}

export default async function ReadingListPage() {
  const articles = await getArticles();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">阅读练习</h1>
        <p className="text-gray-500 text-sm">
          选择一篇文章开始阅读练习，点击文中单词即可查看中文释义
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">暂无文章</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
