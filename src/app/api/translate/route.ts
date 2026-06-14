import { NextResponse } from "next/server";
import { lookupWord } from "@/lib/dictionary";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  if (!word) {
    return NextResponse.json({ error: "Missing word parameter" }, { status: 400 });
  }

  const translationCn = lookupWord(word);

  return NextResponse.json({
    word: word.toLowerCase(),
    translationCn,
  });
}
