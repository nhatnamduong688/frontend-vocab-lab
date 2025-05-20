import { Vocabulary } from '../types/vocabulary';

interface VocabularyIndex {
  metadata: {
    version: string;
    lastUpdated: string;
    totalTerms: number;
    categories: string[];
  };
  availableTypes: {
    type: string;
    count: number;
    file: string;
  }[];
  allWordsFile: string;
}

// Cache for loaded vocabulary data
const cache: Record<string, Vocabulary[]> = {};

/**
 * Helper function to log errors
 */
const logError = (message: string, error: any) => {
  console.error(`[VocabularyService] ${message}:`, error);
};

/**
 * Check if the response is valid
 */
const validateResponse = async (response: Response, errorContext: string) => {
  if (!response.ok) {
    throw new Error(`${errorContext} - HTTP error ${response.status}`);
  }
  
  try {
    return await response.json();
  } catch (error) {
    logError(`${errorContext} - Invalid JSON`, error);
    throw error;
  }
};

/**
 * Fetch the vocabulary index file
 */
export const fetchVocabularyIndex = async (): Promise<VocabularyIndex> => {
  try {
    console.log('[VocabularyService] Fetching vocabulary index...');
    
    const response = await fetch('/vocabulary/index.json');
    const data = await validateResponse(response, 'Fetching vocabulary index');
    
    console.log('[VocabularyService] Loaded index data with types:', 
      data.availableTypes?.map((t: any) => t.type).join(', ') || 'none');
      
    return data;
  } catch (error) {
    logError('Error loading vocabulary index', error);
    // Return a valid empty index
    return {
      metadata: { version: '1.0.0', lastUpdated: '', totalTerms: 0, categories: [] },
      availableTypes: [],
      allWordsFile: 'all.json'
    };
  }
};

/**
 * Fetch vocabulary by type
 * @param type The type of vocabulary to fetch (noun, verb, etc.) or 'all' for all vocabulary
 */
export const fetchVocabularyByType = async (type: string): Promise<Vocabulary[]> => {
  try {
    console.log(`[VocabularyService] Fetching vocabulary for type: ${type}`);
    
    // Return from cache if available
    if (cache[type]) {
      console.log(`[VocabularyService] Returning ${cache[type].length} items from cache for type: ${type}`);
      return cache[type];
    }

    // Determine the file path
    const filePath = type === 'all' 
      ? '/vocabulary/all.json' 
      : `/vocabulary/types/${type}.json`;
    
    console.log(`[VocabularyService] Loading from: ${filePath}`);
    
    const response = await fetch(filePath);
    const data = await validateResponse(response, `Fetching vocabulary for type ${type}`);
    
    // Extract and transform the vocabulary data
    if (!data || !data.vocabulary || !Array.isArray(data.vocabulary)) {
      console.warn(`[VocabularyService] Invalid data format for type ${type}:`, data);
      return [];
    }
    
    // Transform and normalize the data
    const transformedData = data.vocabulary.map((item: any, index: number) => ({
      ...item,
      id: item.id || `word-${index}`,
      type: item.type || type,
      difficulty: item.difficulty || 'medium',
      frequency: typeof item.frequency === 'number' ? item.frequency : 1
    }));
    
    console.log(`[VocabularyService] Loaded ${transformedData.length} items for type: ${type}`);
    
    // Store in cache
    cache[type] = transformedData;
    
    return transformedData;
  } catch (error) {
    logError(`Error loading vocabulary for type ${type}`, error);
    return [];
  }
};

/**
 * Fetch all vocabulary data
 */
export const fetchVocabulary = async (): Promise<Vocabulary[]> => {
  return fetchVocabularyByType('all');
};

/**
 * Clear the cache (useful when new data is added)
 */
export const clearVocabularyCache = () => {
  console.log('[VocabularyService] Clearing cache');
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}; 