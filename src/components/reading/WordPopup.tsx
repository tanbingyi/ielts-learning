"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Spinner from "@/components/ui/Spinner";
import { speakWord } from "@/lib/speech";

interface Props {
  word: string;
  translationCn: string | null;
  loading: boolean;
  x: number;
  y: number;
  onClose: () => void;
}

export default function WordPopup({
  word,
  translationCn,
  loading,
  x,
  y,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleSpeak = useCallback(() => {
    speakWord(word, setSpeaking);
  }, [word]);

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-white border border-mint-300 rounded-xl shadow-lg p-4 min-w-[180px] max-w-[260px]"
      style={{
        left: Math.min(x - 90, window.innerWidth - 280),
        top: y - 8,
        transform: "translateY(-100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-gray-800 text-base">{word}</span>
        <button
          onClick={handleSpeak}
          disabled={speaking}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-mint-50 hover:bg-mint-100 text-mint-600 hover:text-mint-700 transition-colors cursor-pointer disabled:opacity-50"
          title="英音朗读"
        >
          {speaking ? (
            <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Spinner className="w-4 h-4" />
          查询中...
        </div>
      ) : translationCn ? (
        <div>
          <p className="text-mint-700 text-sm">{translationCn}</p>
          <p className="text-xs text-green-500 mt-1">已保存到生词本</p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">暂无翻译</p>
      )}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full"
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid white",
        }}
      />
    </div>
  );
}
