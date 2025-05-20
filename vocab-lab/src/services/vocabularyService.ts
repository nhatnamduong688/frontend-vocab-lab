import { VocabularyItem, VocabularyMetadata, VocabularyTypeInfo } from '../types/vocabulary';

// Interface cho dữ liệu từ vựng
interface VocabularyData {
  metadata: VocabularyMetadata & { type?: string };
  vocabulary: VocabularyItem[];
}

// Interface cho dữ liệu index
interface VocabularyIndex {
  metadata: VocabularyMetadata & {
    types: VocabularyTypeInfo[];
  };
}

// Cache để lưu trữ dữ liệu đã tải
const cache: {
  index?: VocabularyIndex;
  types: Record<string, VocabularyData>;
} = {
  types: {}
};

/**
 * Tải thông tin index của từ vựng
 */
export async function loadVocabularyIndex(): Promise<VocabularyIndex> {
  if (cache.index) {
    return cache.index;
  }

  try {
    const response = await fetch('/vocabulary/types/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load vocabulary index: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as VocabularyIndex;
    cache.index = data;
    return data;
  } catch (error) {
    console.error('Error loading vocabulary index:', error);
    throw error;
  }
}

/**
 * Tải dữ liệu từ vựng cho một loại cụ thể
 */
export async function loadVocabularyByType(type: string): Promise<VocabularyData> {
  // Nếu đã có trong cache, trả về từ cache
  if (cache.types[type]) {
    return cache.types[type];
  }

  try {
    const response = await fetch(`/vocabulary/types/${type}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load vocabulary data for type ${type}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as VocabularyData;
    // Lưu vào cache
    cache.types[type] = data;
    return data;
  } catch (error) {
    console.error(`Error loading vocabulary data for type ${type}:`, error);
    throw error;
  }
}

/**
 * Lấy tất cả loại từ vựng có sẵn
 */
export async function getAvailableTypes(): Promise<VocabularyTypeInfo[]> {
  const index = await loadVocabularyIndex();
  return index.metadata.types || [];
}

/**
 * Lấy danh sách từ vựng theo loại
 */
export async function getVocabularyByType(type: string): Promise<VocabularyItem[]> {
  const data = await loadVocabularyByType(type);
  return data.vocabulary || [];
}

/**
 * Lấy thông tin metadata cho một loại từ vựng
 */
export async function getTypeMetadata(type: string): Promise<VocabularyMetadata> {
  const data = await loadVocabularyByType(type);
  return data.metadata;
}

/**
 * Lấy tất cả từ vựng từ tất cả các loại
 */
export async function getAllVocabulary(): Promise<VocabularyItem[]> {
  const index = await loadVocabularyIndex();
  const types = index.metadata.types.map(t => t.name);
  
  const allPromises = types.map(type => loadVocabularyByType(type));
  const allData = await Promise.all(allPromises);
  
  return allData.flatMap(data => data.vocabulary);
}

/**
 * Tìm kiếm từ vựng theo chuỗi tìm kiếm
 */
export async function searchVocabulary(
  searchText: string, 
  types?: string[]
): Promise<VocabularyItem[]> {
  const allVocab = await getAllVocabulary();
  const searchLower = searchText.toLowerCase();
  
  return allVocab.filter(item => {
    // Lọc theo type nếu có chỉ định
    if (types && types.length > 0 && !types.includes(item.type)) {
      return false;
    }
    
    // Tìm kiếm theo term hoặc definition
    return (
      item.term.toLowerCase().includes(searchLower) ||
      item.definition.toLowerCase().includes(searchLower)
    );
  });
} 