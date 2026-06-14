"use client";

import type { VocabWord } from "@/types";
import VocabItem from "./VocabItem";

interface Props {
  words: VocabWord[];
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}

export default function VocabSidebar({
  words,
  isOpen,
  onToggle,
  onDelete,
}: Props) {
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed z-40 bg-white border border-mint-200 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-mint-50 transition-all cursor-pointer top-20"
        style={{ right: isOpen ? 284 : 16 }}
        title={isOpen ? "关闭生词本" : "打开生词本"}
      >
        <svg
          className={`w-4 h-4 text-mint-600 transition-transform ${isOpen ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <aside
        className={`shrink-0 border-l border-mint-200 bg-white overflow-y-auto transition-all duration-300 ${
          isOpen ? "w-[280px] p-4" : "w-0 p-0 overflow-hidden border-l-0"
        }`}
      >
        {isOpen && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              生词本
              {words.length > 0 && (
                <span className="ml-1.5 text-mint-500">({words.length})</span>
              )}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              点击文章中的单词自动添加
            </p>

            {words.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">
                还没有生词
                <br />
                点击文章中的单词试试吧
              </p>
            ) : (
              <div className="space-y-2">
                {words.map((w) => (
                  <VocabItem key={w.id} word={w} onDelete={onDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
