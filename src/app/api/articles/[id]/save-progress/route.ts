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

  await prisma.userReadingProgress.upsert({
    where: {
      userId_articleId: { userId: user.id, articleId },
    },
    create: {
      userId: user.id,
      articleId,
      completed: false,
      score: null,
      answers: JSON.stringify(answers),
    },
    update: {
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json({ saved: true });
}
