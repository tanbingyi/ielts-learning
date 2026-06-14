import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: articleId } = await params;
  const { answers } = await request.json();

  if (!answers) {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  }

  const questions = await prisma.articleQuestion.findMany({
    where: { articleId },
    select: { id: true, correctAnswer: true },
  });

  const results = questions.map((q: { id: string; correctAnswer: string }) => ({
    questionId: q.id,
    userAnswer: answers[q.id] || "",
    correctAnswer: q.correctAnswer,
    isCorrect: answers[q.id] === q.correctAnswer,
  }));

  const correctCount = results.filter((r: { isCorrect: boolean }) => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);

  await prisma.userReadingProgress.upsert({
    where: {
      userId_articleId: { userId: user.id, articleId },
    },
    create: {
      userId: user.id,
      articleId,
      completed: true,
      score,
      answers: JSON.stringify(answers),
      completedAt: new Date(),
    },
    update: {
      completed: true,
      score,
      answers: JSON.stringify(answers),
      completedAt: new Date(),
    },
  });

  return NextResponse.json({
    score,
    total: questions.length,
    results,
  });
}
