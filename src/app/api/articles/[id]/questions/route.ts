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

  const questions = await prisma.articleQuestion.findMany({
    where: { articleId: id },
    select: {
      id: true,
      type: true,
      questionText: true,
      options: true,
    },
    orderBy: { orderIndex: "asc" },
  });

  const parsed = questions.map((q: { id: string; type: string; questionText: string; options: string }) => ({
    ...q,
    options: JSON.parse(q.options) as string[],
  }));

  return NextResponse.json({ questions: parsed });
}
