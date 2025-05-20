import { useState, useMemo } from 'react';
import { Vocabulary } from '../types/vocabulary';

export const useVocabularySearch = (words: Vocabulary[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = useMemo(() => 
    words.filter(word =>
      word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [words, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredWords,
  };
}; 