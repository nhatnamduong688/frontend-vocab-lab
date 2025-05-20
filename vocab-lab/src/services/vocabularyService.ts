import { Vocabulary } from '../types/vocabulary';

export const fetchVocabulary = async (): Promise<Vocabulary[]> => {
  try {
    const response = await fetch('/vocabulary.json');
    const data = await response.json();
    
    // Transform the data
    const transformedData = (Array.isArray(data.vocabulary) ? data.vocabulary : data)
      .map((item: any, index: number) => ({
        ...item,
        id: item.id || `word-${index}`,
        difficulty: item.difficulty || 'medium',
        frequency: typeof item.frequency === 'number' ? item.frequency : 1
      }));

    return transformedData;
  } catch (error) {
    console.error('Error loading vocabulary:', error);
    return [];
  }
}; 