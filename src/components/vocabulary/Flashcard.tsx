"use client";

import type { VocabWord } from "@/types";

interface Props {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ word, isFlipped, onFlip }: Props) {
  return (
    <div
      onClick={onFlip}
      className="relative w-full h-64 cursor-pointer perspective-1000"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white border-2 border-mint-200 rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <p className="text-3xl font-bold text-gray-800 mb-3">{word.word}</p>
          {word.contextSentence && (
            <p className="text-sm text-gray-400 text-center leading-relaxed line-clamp-3">
              {word.contextSentence}
            </p>
          )}
          <p className="text-xs text-gray-300 mt-4">点击翻转查看释义</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-mint-50 border-2 border-mint-300 rounded-2xl flex flex-col items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-2xl font-bold text-gray-800 mb-2">{word.word}</p>
          <p className="text-xl text-mint-700 font-medium">{word.translationCn}</p>
          {word.contextSentence && (
            <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed line-clamp-2">
              {word.contextSentence}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
