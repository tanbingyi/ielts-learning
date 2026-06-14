"use client";

import { useEffect, useState } from "react";
import FlashcardDeck from "@/components/vocabulary/FlashcardDeck";
import type { VocabWord } from "@/types";

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vocabulary")
      .then((res) => res.json())
      .then((data) => setWords(data.words))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/vocabulary/${id}`, { method: "DELETE" });
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-solid border-mint-500 border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">单词复习</h1>
        <p className="text-gray-500 text-sm">
          翻转卡片复习生词，点击卡片查看中文释义
        </p>
      </div>

      <FlashcardDeck words={words} onDelete={handleDelete} />
    </div>
  );
}
