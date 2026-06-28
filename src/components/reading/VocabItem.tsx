"use client";

import { useState, useCallback } from "react";
import { speakWord } from "@/lib/speech";
import type { VocabWord } from "@/types";

interface Props {
  word: VocabWord;
  onDelete: (id: string) => void;
}

export default function VocabItem({ word, onDelete }: Props) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      speakWord(word.word, setSpeaking);
    },
    [word.word]
  );

  return (
    <div className="bg-mint-50 border border-mint-100 rounded-lg p-3 text-sm relative group">
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-gray-800">{word.word}</span>
        <button
          onClick={handleSpeak}
          disabled={speaking}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-mint-100 text-mint-500 hover:text-mint-700 transition-colors cursor-pointer disabled:opacity-50"
          title="英音朗读"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        </button>
      </div>
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
