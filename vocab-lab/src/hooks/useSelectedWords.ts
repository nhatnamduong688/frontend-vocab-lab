import { useState, useCallback } from 'react';
import { Vocabulary } from '../types/vocabulary';

export const useSelectedWords = () => {
  const [selectedWords, setSelectedWords] = useState<Vocabulary[]>([]);

  const addWord = useCallback((word: Vocabulary) => {
    setSelectedWords(prev => [...prev, word]);
  }, []);

  const removeWord = useCallback((term: string) => {
    setSelectedWords(prev => prev.filter(word => word.term !== term));
  }, []);

  const clearWords = useCallback(() => {
    setSelectedWords([]);
  }, []);

  const reorderWords = useCallback((fromIndex: number, toIndex: number) => {
    setSelectedWords(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);

  return {
    selectedWords,
    addWord,
    removeWord,
    clearWords,
    reorderWords,
  };
}; 