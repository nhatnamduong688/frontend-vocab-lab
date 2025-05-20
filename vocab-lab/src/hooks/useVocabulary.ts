import { useState, useEffect } from 'react';
import { Vocabulary } from '../types/vocabulary';
import { fetchVocabulary } from '../services/vocabularyService';

export const useVocabulary = () => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedWords, setSelectedWords] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    try {
      setLoading(true);
      const data = await fetchVocabulary();
      setVocabulary(data);
      setError(null);
    } catch (err) {
      setError('Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const handleWordSelect = (word: Vocabulary) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (term: string) => {
    setSelectedWords(prev => prev.filter(word => word.term !== term));
  };

  const vocabularyByType = vocabulary.reduce<Record<string, Vocabulary[]>>((acc, word) => {
    const type = word.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(word);
    return acc;
  }, {});

  return {
    vocabulary,
    selectedWords,
    loading,
    error,
    vocabularyByType,
    handleWordSelect,
    handleRemoveWord,
  };
}; 