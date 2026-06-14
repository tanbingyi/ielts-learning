import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");

  const where: Record<string, string> = { userId: user.id };
  if (articleId) where.articleId = articleId;

  const words = await prisma.userVocabulary.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ words });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { word, translationCn, contextSentence, articleId } = await request.json();

  if (!word || !translationCn) {
    return NextResponse.json(
      { error: "Missing word or translation" },
      { status: 400 }
    );
  }

  const cleaned = word.toLowerCase().trim();

  const existing = await prisma.userVocabulary.findUnique({
    where: { userId_word: { userId: user.id, word: cleaned } },
  });

  if (existing) {
    return NextResponse.json({ word: existing, existed: true });
  }

  const entry = await prisma.userVocabulary.create({
    data: {
      userId: user.id,
      word: cleaned,
      translationCn,
      contextSentence: contextSentence || null,
      articleId: articleId || null,
    },
  });

  return NextResponse.json({ word: entry, existed: false }, { status: 201 });
}
