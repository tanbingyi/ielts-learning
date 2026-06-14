"use client";

import { useEffect, useRef } from "react";
import Spinner from "@/components/ui/Spinner";

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

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
      <div className="font-semibold text-gray-800 text-base mb-1">{word}</div>
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
