export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type VocabularyType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';

export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
  level?: string;
  createdAt?: number;
  type: string;
  example?: string;
  category: string;
  difficulty: DifficultyLevel;
  frequency: number;
  interviewImportance: string;
  description: string;
  relatedTerms: string[];
  codeExample: string;
  commonQuestions: string[];
}

export interface VocabularyMetadata {
  version: string;
  lastUpdated: string;
  totalTerms: number;
  categories: string[];
}

export interface VocabularyData {
  metadata: VocabularyMetadata;
  vocabulary: Vocabulary[];
}

export interface SearchOptions {
  term?: string;
  type?: VocabularyType;
  difficulty?: DifficultyLevel;
  category?: string;
}

export interface VocabularyStats {
  totalWords: number;
  byDifficulty: Record<DifficultyLevel, number>;
  byType: Record<VocabularyType, number>;
  averageFrequency: number;
}

export interface VocabularySortOptions {
  field: keyof Vocabulary;
  direction: 'asc' | 'desc';
}

export interface Word {
  id: string;
  term: string;
  definition: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number;
  example?: string;
}

export interface SelectedWord extends Word {
  position: number; // Position in the sentence
}

export interface VocabularyItem {
  id: string;
  term: string;
  definition: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number;
  category: string;
  example: string;
  interviewImportance: 'low' | 'medium' | 'high';
  description: string;
  relatedTerms: string[];
  codeExample: string;
  commonQuestions: string[];
}

export interface VocabularyTypeInfo {
  name: string;
  count: number;
}

export type VocabularyImportance = 'low' | 'medium' | 'high';

export type FlashcardMode = 'term-to-definition' | 'definition-to-term' | 'mixed';

export interface FlashcardSettings {
  mode: FlashcardMode;
  showExamples: boolean;
  showCodeExamples: boolean;
  filterByTypes?: string[];
  filterByDifficulty?: DifficultyLevel[];
  limitCount?: number;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  example?: string;
  codeExample?: string;
  type: string;
  difficulty: DifficultyLevel;
}

export interface FlashcardSession {
  id: string;
  date: string;
  settings: FlashcardSettings;
  cards: Flashcard[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  completedCardIds: string[];
}

export type FlashcardStatus = 'correct' | 'incorrect' | 'skipped' | 'not-answered'; 