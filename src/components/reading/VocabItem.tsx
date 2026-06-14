"use client";

import type { VocabWord } from "@/types";

interface Props {
  word: VocabWord;
  onDelete: (id: string) => void;
}

export default function VocabItem({ word, onDelete }: Props) {
  return (
    <div className="bg-mint-50 border border-mint-100 rounded-lg p-3 text-sm relative group">
      <div className="font-medium text-gray-800">{word.word}</div>
      <div className="text-mint-700 text-xs mt-0.5">{word.translationCn}</div>
      {word.contextSentence && (
        <div className="text-gray-400 text-xs mt-1 truncate">
          {word.contextSentence}
        </div>
      )}
      <button
        onClick={() => onDelete(word.id)}
        className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        title="移除"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
