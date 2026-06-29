"use client";

import { useState, useCallback } from "react";
import WordPopup from "./WordPopup";

interface Props {
  content: string;
  onWordClick: (word: string, translationCn: string) => void;
}

const PARAGRAPH_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function renderParagraph(text: string, onWordClick: (word: string, e: React.MouseEvent) => void) {
  const tokens = text.match(/\b[\w'-]+\b|[^\w\s]+|\s+/g) || [];
  return tokens.map((token, i) => {
    if (/^\s+$/.test(token) || /^[^\w\s]+$/.test(token)) {
      return <span key={i}>{token}</span>;
    }
    if (!/^[a-zA-Z]/.test(token)) {
      return <span key={i}>{token}</span>;
    }
    return (
      <span
        key={i}
        onClick={(e) => onWordClick(token, e)}
        className="cursor-pointer hover:bg-mint-200 rounded px-0.5 -mx-0.5 transition-colors duration-100 inline-block"
        title="点击查看中文释义"
      >
        {token}
      </span>
    );
  });
}

export default function ArticleContent({ content, onWordClick }: Props) {
  const [popup, setPopup] = useState<{
    word: string;
    translationCn: string | null;
    x: number;
    y: number;
    loading: boolean;
  } | null>(null);

  const handleWordClick = useCallback(
    async (word: string, event: React.MouseEvent) => {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setPopup({
        word,
        translationCn: null,
        x: rect.left + rect.width / 2,
        y: rect.top,
        loading: true,
      });

      try {
        const res = await fetch(
          `/api/translate?word=${encodeURIComponent(word)}`
        );
        const data = await res.json();
        const translationCn = data.translationCn;

        setPopup((prev) =>
          prev
            ? { ...prev, translationCn, loading: false }
            : null
        );

        if (translationCn) {
          onWordClick(word, translationCn);
        }
      } catch {
        setPopup(null);
      }
    },
    [onWordClick]
  );

  // Split content into paragraphs by double newlines
  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <div className="relative">
      <div className="text-base leading-8 text-gray-700">
        {paragraphs.map((para, idx) => (
          <div key={idx} className="flex gap-3 mb-5">
            {/* Paragraph label */}
            <span className="text-xs font-bold text-mint-500 mt-1.5 select-none flex-shrink-0 w-6 text-right">
              {PARAGRAPH_LABELS[idx] || "?"}
            </span>
            <div className="min-w-0">
              {renderParagraph(para, handleWordClick)}
            </div>
          </div>
        ))}
      </div>

      {popup && (
        <WordPopup
          word={popup.word}
          translationCn={popup.translationCn}
          loading={popup.loading}
          x={popup.x}
          y={popup.y}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
