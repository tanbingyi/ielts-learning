import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.article.findMany({
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
  });

  const progress = await prisma.userReadingProgress.findMany({
    where: { userId: user.id },
    select: { articleId: true, completed: true, score: true },
  });

  type ProgressEntry = { articleId: string; completed: boolean; score: number | null };
  const progressMap = new Map<string, ProgressEntry>();
  progress.forEach((p: ProgressEntry) => progressMap.set(p.articleId, p));

  const result = articles.map((a: { id: string; title: string; titleCn: string; difficulty: string; category: string; source: string | null; section: string | null; _count: { questions: number } }) => ({
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

  return NextResponse.json({ articles: result });
}
