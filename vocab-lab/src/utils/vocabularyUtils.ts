import { Vocabulary } from '../types/vocabulary';

export const groupVocabularyByType = (vocabulary: Vocabulary[]): Record<string, Vocabulary[]> => {
  return vocabulary.reduce<Record<string, Vocabulary[]>>((acc, word) => {
    const type = word.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(word);
    return acc;
  }, {});
};

export const transformVocabularyData = (data: any[]): Vocabulary[] => {
  return data.map((item, index) => ({
    ...item,
    id: item.id || `word-${index}`,
    difficulty: item.difficulty || 'medium',
    frequency: typeof item.frequency === 'number' ? item.frequency : 1
  }));
};

export const sortVocabularyByFrequency = (vocabulary: Vocabulary[]): Vocabulary[] => {
  return [...vocabulary].sort((a, b) => b.frequency - a.frequency);
};

export const filterVocabularyByDifficulty = (
  vocabulary: Vocabulary[], 
  difficulty: 'easy' | 'medium' | 'hard'
): Vocabulary[] => {
  return vocabulary.filter(word => word.difficulty === difficulty);
}; 