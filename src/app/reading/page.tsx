import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ArticleCard from "@/components/reading/ArticleCard";
import type { ArticleSummary } from "@/types";

export default async function ReadingListPage() {
  const user = await getSession();

  let articles: ArticleSummary[] = [];
  const progressMap = new Map<string, { completed: boolean; score: number | null }>();

  if (user) {
    const [rawArticles, progress] = await Promise.all([
      prisma.article.findMany({
        select: {
          id: true,
          title: true,
          titleCn: true,
          difficulty: true,
          category: true,
          source: true,
          section: true,
          _count: { select: { questions: true } },
        },
        orderBy: { source: "desc", section: "asc", createdAt: "desc" },
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
      source: a.source,
      section: a.section,
      questionCount: a._count.questions,
      completed: progressMap.get(a.id)?.completed ?? false,
      score: progressMap.get(a.id)?.score ?? null,
    }));
  }

  // Group articles by source
  type Group = { source: string; articles: ArticleSummary[] };
  const groups: Group[] = [];
  const seen = new Map<string, Group>();

  for (const a of articles) {
    const key = a.source || "Sample";
    let group = seen.get(key);
    if (!group) {
      group = { source: key, articles: [] };
      seen.set(key, group);
      groups.push(group);
    }
    group.articles.push(a);
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
        groups.map((group) => (
          <div key={group.source} className="mb-10">
            <h2 className="text-lg font-bold text-mint-700 mb-4 flex items-center gap-2">
              {group.source === "Cambridge IELTS 14" ? (
                <>
                  <span className="bg-mint-100 text-mint-700 text-xs font-medium px-2 py-0.5 rounded">
                    CAMBRIDGE 14
                  </span>
                  剑桥雅思真题 14
                </>
              ) : (
                <span className="text-gray-500 text-sm font-normal">
                  预置练习文章
                </span>
              )}
            </h2>

            {/* For Cambridge 14: show Test sub-groups */}
            {group.source === "Cambridge IELTS 14" ? (
              (() => {
                const testGroups = new Map<string, ArticleSummary[]>();
                for (const a of group.articles) {
                  const s = a.section || "Other";
                  const list = testGroups.get(s) || [];
                  list.push(a);
                  testGroups.set(s, list);
                }
                return Array.from(testGroups.entries()).map(([testName, testArticles]) => (
                  <div key={testName} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 border-l-2 border-mint-400 pl-3">
                      {testName}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {testArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                ));
              })()
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {group.articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
