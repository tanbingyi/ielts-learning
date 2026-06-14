"use client";

import { useState, useMemo } from "react";
import Flashcard from "./Flashcard";
import type { VocabWord } from "@/types";

interface Props {
  words: VocabWord[];
  onDelete: (id: string) => void;
}

export default function FlashcardDeck({ words, onDelete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const deck = useMemo(() => {
    if (!shuffled) return words;
    const arr = [...words];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [words, shuffled]);

  if (words.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-gray-500 mb-3">还没有生词</p>
        <p className="text-gray-400 text-sm mb-4">
          去阅读文章中点击单词，就能把它们加入生词本
        </p>
        <a
          href="/reading"
          className="inline-block bg-mint-500 hover:bg-mint-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors no-underline"
        >
          去阅读文章
        </a>
      </div>
    );
  }

  const current = deck[currentIndex];
  if (!current) return null;

  const goNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleDelete = () => {
    onDelete(current.id);
    if (currentIndex >= deck.length - 1) {
      setCurrentIndex(Math.max(0, deck.length - 2));
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Flashcard word={current} isFlipped={isFlipped} onFlip={handleFlip} />

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full border border-mint-200 flex items-center justify-center hover:bg-mint-50 transition-colors cursor-pointer"
          title="上一个"
        >
          <svg className="w-5 h-5 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleFlip}
          className="bg-mint-500 hover:bg-mint-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors cursor-pointer"
        >
          翻转
        </button>

        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full border border-mint-200 flex items-center justify-center hover:bg-mint-50 transition-colors cursor-pointer"
          title="下一个"
        >
          <svg className="w-5 h-5 text-mint-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setShuffled((s) => !s)}
          className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
            shuffled
              ? "border-mint-300 bg-mint-50 text-mint-700"
              : "border-gray-200 text-gray-400 hover:border-mint-200"
          }`}
        >
          {shuffled ? "已随机" : "随机顺序"}
        </button>

        <p className="text-sm text-gray-400">
          {currentIndex + 1} / {deck.length}
        </p>

        <button
          onClick={handleDelete}
          className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
        >
          移除
        </button>
      </div>
    </div>
  );
}
