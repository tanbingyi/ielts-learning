export interface User {
  id: string;
  username: string;
  email: string | null;
  emailVerified: boolean;
}

export interface ArticleSummary {
  id: string;
  title: string;
  titleCn: string;
  difficulty: string;
  category: string;
  source?: string | null;
  section?: string | null;
  questionCount: number;
  completed?: boolean;
  score?: number | null;
}

export interface ArticleDetail {
  id: string;
  title: string;
  titleCn: string;
  content: string;
  translation: string;
  difficulty: string;
  category: string;
}

export interface Question {
  id: string;
  type: "multiple_choice" | "true_false" | "true_false_not_given" | "yes_no_not_given" | "note_completion";
  questionText: string;
  options: string[];
}

export interface SubmitResult {
  score: number;
  total: number;
  results: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface VocabWord {
  id: string;
  word: string;
  translationCn: string;
  contextSentence?: string | null;
  articleId?: string | null;
  createdAt: string;
}
