"use client";

import { useCallback, useState } from "react";
import { speakWord } from "@/lib/speech";
import type { VocabWord } from "@/types";

interface Props {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function Flashcard({ word, isFlipped, onFlip }: Props) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      speakWord(word.word, setSpeaking);
    },
    [word.word]
  );

  const SpeakerIcon = () => (
    <button
      onClick={handleSpeak}
      disabled={speaking}
      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/60 hover:bg-white/90 text-mint-600 hover:text-mint-700 transition-colors cursor-pointer disabled:opacity-50"
      title="英音朗读"
    >
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    </button>
  );

  return (
    <div className="relative w-full h-64 perspective-1000">
      <div
        onClick={onFlip}
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-white border-2 border-mint-200 rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-3xl font-bold text-gray-800">{word.word}</p>
            <SpeakerIcon />
          </div>
          {word.contextSentence && (
            <p className="text-sm text-gray-400 text-center leading-relaxed line-clamp-3">
              {word.contextSentence}
            </p>
          )}
          <p className="text-xs text-gray-300 mt-4">点击翻转查看释义</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-mint-50 border-2 border-mint-300 rounded-2xl flex flex-col items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-2xl font-bold text-gray-800">{word.word}</p>
            <SpeakerIcon />
          </div>
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
