import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ArticleCard from "@/components/reading/ArticleCard";
import type { ArticleSummary } from "@/types";

export default async function ReadingListPage() {
  const user = await getSession();

  let articles: ArticleSummary[] = [];
  let progressMap = new Map<string, { completed: boolean; score: number | null }>();

  if (user) {
    const [rawArticles, progress] = await Promise.all([
      prisma.article.findMany({
        select: {
          id: true,
          title: true,
          titleCn: true,
          difficulty: true,
          category: true,
          _count: { select: { questions: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.userReadingProgress.findMany({
        where: { userId: user.id },
        select: { articleId: true, completed: true, score: true },
      }),
    ]);

    progress.forEach((p) => progressMap.set(p.articleId, p));

    articles = rawArticles.map((a) => ({
      id: a.id,
      title: a.title,
      titleCn: a.titleCn,
      difficulty: a.difficulty,
      category: a.category,
      questionCount: a._count.questions,
      completed: progressMap.get(a.id)?.completed ?? false,
      score: progressMap.get(a.id)?.score ?? null,
    }));
  }

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
