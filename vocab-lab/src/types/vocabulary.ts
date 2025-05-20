export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
  type: string;
  example?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
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