"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ArticleContent from "@/components/reading/ArticleContent";
import VocabSidebar from "@/components/reading/VocabSidebar";
import QuestionPanel from "@/components/reading/QuestionPanel";
import ScoreDisplay from "@/components/reading/ScoreDisplay";
import type { ArticleDetail, VocabWord, Question, SubmitResult } from "@/types";

export default function ArticleReaderPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [existingProgress, setExistingProgress] = useState<{
    completed: boolean;
    score: number | null;
    answers?: Record<string, string>;
  } | null>(null);
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});

  const fetchVocab = useCallback(async () => {
    const res = await fetch(`/api/vocabulary?articleId=${id}`);
    if (res.ok) {
      const data = await res.json();
      setVocabWords(data.words);
    }
  }, [id]);

  const saveWord = useCallback(
    async (word: string, translationCn: string) => {
      const sentence = getContextSentence(article?.content || "", word);
      await fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word,
          translationCn,
          contextSentence: sentence,
          articleId: id,
        }),
      });
      await fetchVocab();
    },
    [id, article, fetchVocab]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [articleRes, vocabRes, questionsRes] = await Promise.all([
          fetch(`/api/articles/${id}`),
          fetch(`/api/vocabulary?articleId=${id}`),
          fetch(`/api/articles/${id}/questions`),
        ]);

        if (articleRes.ok) {
          const data = await articleRes.json();
          setArticle(data.article);
          if (data.progress) {
            setExistingProgress(data.progress);
            // Restore saved answers
            if (data.progress.answers) {
              try {
                const parsed = JSON.parse(data.progress.answers);
                setSavedAnswers(parsed);
              } catch { /* ignore parse error */ }
            }
            if (data.progress.completed) {
              setShowQuiz(true);
            }
          }
        }

        if (vocabRes.ok) {
          const data = await vocabRes.json();
          setVocabWords(data.words);
        }

        if (questionsRes.ok) {
          const data = await questionsRes.json();
          setQuestions(data.questions);
          setShowQuiz(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStartQuiz = async () => {
    const res = await fetch(`/api/articles/${id}/questions`);
    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions);
      setShowQuiz(true);
    }
  };

  const handleSubmit = async (answers: Record<string, string>) => {
    const res = await fetch(`/api/articles/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    }
  };

  const handleSaveProgress = useCallback(async (answers: Record<string, string>) => {
    setSavedAnswers(answers);
    await fetch(`/api/articles/${id}/save-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
  }, [id]);

  const handleRetry = () => {
    setShowQuiz(true);
    setResult(null);
  };

  const handleDeleteVocab = async (wordId: string) => {
    await fetch(`/api/vocabulary/${wordId}`, { method: "DELETE" });
    setVocabWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-solid border-mint-500 border-r-transparent" />
        <p className="mt-4 text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400">文章未找到</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-mint-100 text-mint-700 mb-2">
              {article.difficulty}
            </span>
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              {article.title}
            </h1>
          </div>

          <ArticleContent content={article.content} onWordClick={saveWord} />

          {existingProgress?.completed && result === null && !showQuiz && (
            <div className="mt-8 p-6 bg-mint-50 border border-mint-200 rounded-xl text-center">
              <p className="text-mint-700 font-medium mb-3">
                你已完成本篇文章的练习
              </p>
              <p className="text-2xl font-bold text-mint-600 mb-4">
                得分: {existingProgress.score}%
              </p>
              <button
                onClick={handleRetry}
                className="bg-mint-500 hover:bg-mint-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors cursor-pointer"
              >
                重新答题
              </button>
            </div>
          )}

          {!result && showQuiz && questions.length > 0 && (
            <div className="mt-8">
              <QuestionPanel
                questions={questions}
                initialAnswers={savedAnswers}
                onSave={handleSaveProgress}
                onSubmit={handleSubmit}
              />
            </div>
          )}

          {result && (
            <div className="mt-8">
              <ScoreDisplay
                result={result}
                questions={questions}
                onRetry={handleRetry}
              />
            </div>
          )}

          <div className="h-12" />
        </div>
      </div>

      <VocabSidebar
        words={vocabWords}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        onDelete={handleDeleteVocab}
      />
    </div>
  );
}

function getContextSentence(content: string, word: string): string | null {
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
  const lower = word.toLowerCase();
  const found = sentences.find((s) =>
    s.toLowerCase().split(/\W+/).includes(lower)
  );
  return found ? found.trim() : null;
}
