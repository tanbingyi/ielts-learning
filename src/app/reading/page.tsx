import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import ReadingList from "@/components/reading/ReadingList";
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
        orderBy: [{ source: "desc" }, { section: "asc" }, { createdAt: "desc" }],
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
      <ReadingList groups={groups} />
    </div>
  );
}
