import { useState, useEffect, useCallback } from 'react';
import { Vocabulary } from '../types/vocabulary';
import { 
  fetchVocabulary, 
  fetchVocabularyByType, 
  fetchVocabularyIndex,
  clearVocabularyCache
} from '../services/vocabularyService';

export const useVocabulary = () => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedWords, setSelectedWords] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [currentTypeFilter, setCurrentTypeFilter] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load vocabulary index and available types
  const loadVocabularyIndex = useCallback(async () => {
    try {
      console.log('Loading vocabulary index...');
      const indexData = await fetchVocabularyIndex();
      if (indexData && indexData.availableTypes) {
        const types = indexData.availableTypes.map(t => t.type);
        console.log('Available types:', types);
        setAvailableTypes(types);
      } else {
        console.warn('No vocabulary types found in index data');
        setAvailableTypes([]);
      }
    } catch (err) {
      console.error('Error loading vocabulary index:', err);
      setAvailableTypes([]);
    }
  }, []);

  // Load all vocabulary when the component mounts
  const loadVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading all vocabulary...');
      const data = await fetchVocabulary();
      console.log(`Loaded ${data.length} vocabulary items`);
      setVocabulary(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load vocabulary:', err);
      setError('Failed to load vocabulary');
      setVocabulary([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Load vocabulary by type when type filter changes
  const loadVocabularyByType = useCallback(async (type: string) => {
    try {
      setLoading(true);
      console.log(`Loading vocabulary for type: ${type}`);
      const data = await fetchVocabularyByType(type);
      console.log(`Loaded ${data.length} ${type} vocabulary items`);
      setVocabulary(data);
      setError(null);
    } catch (err) {
      console.error(`Failed to load ${type} vocabulary:`, err);
      setError(`Failed to load ${type} vocabulary`);
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial loading
  useEffect(() => {
    const initializeData = async () => {
      await loadVocabularyIndex();
      await loadVocabulary();
    };
    
    initializeData();
  }, [loadVocabularyIndex, loadVocabulary]);

  // Load vocabulary by type when type filter changes
  useEffect(() => {
    if (initialized && currentTypeFilter) {
      loadVocabularyByType(currentTypeFilter);
    }
  }, [currentTypeFilter, loadVocabularyByType, initialized]);

  const handleWordSelect = (word: Vocabulary) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (term: string) => {
    setSelectedWords(prev => prev.filter(word => word.term !== term));
  };

  // Group vocabulary by type
  const vocabularyByType = vocabulary.reduce<Record<string, Vocabulary[]>>((acc, word) => {
    const type = word.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(word);
    return acc;
  }, {});

  const refreshVocabulary = useCallback(() => {
    clearVocabularyCache();
    loadVocabulary();
  }, [loadVocabulary]);

  const setTypeFilter = useCallback((type: string | null) => {
    console.log(`Setting type filter to: ${type}`);
    setCurrentTypeFilter(type);
  }, []);

  return {
    vocabulary,
    selectedWords,
    loading,
    error,
    vocabularyByType,
    availableTypes,
    currentTypeFilter,
    handleWordSelect,
    handleRemoveWord,
    setCurrentTypeFilter: setTypeFilter,
    refreshVocabulary,
  };
}; 