import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      titleCn: true,
      content: true,
      translation: true,
      difficulty: true,
      category: true,
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const progress = await prisma.userReadingProgress.findUnique({
    where: { userId_articleId: { userId: user.id, articleId: id } },
    select: { completed: true, score: true, answers: true },
  });

  const vocabCount = await prisma.userVocabulary.count({
    where: { userId: user.id, articleId: id },
  });

  return NextResponse.json({
    article,
    progress: progress ?? { completed: false, score: null },
    vocabCount,
  });
}
