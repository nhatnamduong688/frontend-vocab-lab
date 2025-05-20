import { VocabularyItem, VocabularyMetadata, VocabularyTypeInfo } from '../types/vocabulary';

// API Server URL - Thay đổi nếu cần
const API_URL = 'http://localhost:3001/api';

// Interface cho dữ liệu từ vựng
interface VocabularyData {
  metadata: VocabularyMetadata & { type?: string };
  vocabulary: VocabularyItem[];
  terms?: VocabularyItem[];
}

// Interface cho dữ liệu index
interface VocabularyIndex {
  metadata: VocabularyMetadata & {
    types: VocabularyTypeInfo[];
  };
  availableTypes?: Array<{
    type: string;
    count: number;
    file: string;
  }>;
}

// Cache để lưu trữ dữ liệu đã tải
const cache: {
  index?: VocabularyIndex;
  types: Record<string, VocabularyData>;
  allVocabulary?: VocabularyItem[];
} = {
  types: {}
};

/**
 * Xóa cache để buộc tải lại dữ liệu
 */
export function clearCache() {
  cache.index = undefined;
  cache.types = {};
  cache.allVocabulary = undefined;
}

/**
 * Tải thông tin index của từ vựng từ API
 */
export async function loadVocabularyIndex(): Promise<VocabularyIndex> {
  if (cache.index) {
    return cache.index;
  }

  try {
    const response = await fetch(`${API_URL}/vocabulary/index`);
    if (!response.ok) {
      throw new Error(`Failed to load vocabulary index: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as VocabularyIndex;
    cache.index = data;
    return data;
  } catch (error) {
    console.error('Error loading vocabulary index:', error);
    
    // Fallback vào file cũ nếu API chưa hoạt động
    try {
      const response = await fetch('/vocabulary/index.json');
      if (!response.ok) {
        throw error; // Throw original error if fallback also fails
      }
      const data = await response.json() as VocabularyIndex;
      cache.index = data;
      console.warn('Using fallback vocabulary index from static file');
      return data;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error;
    }
  }
}

/**
 * Tải dữ liệu từ vựng cho một loại cụ thể từ API
 */
export async function loadVocabularyByType(type: string): Promise<VocabularyData> {
  // Nếu đã có trong cache, trả về từ cache
  if (cache.types[type]) {
    return cache.types[type];
  }

  try {
    const response = await fetch(`${API_URL}/vocabulary/types/${type}`);
    if (!response.ok) {
      throw new Error(`Failed to load vocabulary data for type ${type}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as VocabularyData;
    // Lưu vào cache
    cache.types[type] = data;
    return data;
  } catch (error) {
    console.error(`Error loading vocabulary data for type ${type} from API:`, error);
    
    // Fallback vào file cũ nếu API chưa hoạt động
    try {
      const response = await fetch(`/vocabulary/types/${type}.json`);
      if (!response.ok) {
        throw error; // Throw original error if fallback also fails
      }
      const data = await response.json() as VocabularyData;
      cache.types[type] = data;
      console.warn(`Using fallback vocabulary data for type ${type} from static file`);
      return data;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error;
    }
  }
}

/**
 * Lấy tất cả từ vựng từ API
 */
export async function loadAllVocabulary(): Promise<VocabularyItem[]> {
  if (cache.allVocabulary) {
    return cache.allVocabulary;
  }
  
  try {
    const response = await fetch(`${API_URL}/vocabulary`);
    if (!response.ok) {
      throw new Error(`Failed to load all vocabulary: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    cache.allVocabulary = data.vocabulary || [];
    return cache.allVocabulary as VocabularyItem[];
  } catch (error) {
    console.error('Error loading all vocabulary from API:', error);
    
    // Fallback vào phương thức cũ (lấy từng loại)
    try {
      const result = await getAllVocabularyByTypes();
      console.warn('Using fallback method to get all vocabulary');
      return result;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error;
    }
  }
}

/**
 * Lấy tất cả loại từ vựng có sẵn từ API
 */
export async function getAvailableTypes(): Promise<VocabularyTypeInfo[]> {
  try {
    const response = await fetch(`${API_URL}/types`);
    if (!response.ok) {
      throw new Error(`Failed to load available types: ${response.status} ${response.statusText}`);
    }
    
    const types = await response.json() as VocabularyTypeInfo[];
    return types || [];
  } catch (error) {
    console.error('Error loading available types from API:', error);
    
    // Fallback vào phương thức cũ
    try {
      const index = await loadVocabularyIndex();
      console.warn('Using fallback method to get available types');
      return index.metadata.types || [];
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error;
    }
  }
}

/**
 * Phương thức cũ để lấy tất cả từ vựng từ nhiều loại
 */
async function getAllVocabularyByTypes(): Promise<VocabularyItem[]> {
  const index = await loadVocabularyIndex();
  const types = index.metadata.types.map(t => t.name);
  
  const allPromises = types.map(type => loadVocabularyByType(type));
  const allData = await Promise.all(allPromises);
  
  return allData.flatMap(data => data.vocabulary);
}

/**
 * Lấy danh sách từ vựng theo loại
 */
export async function getVocabularyByType(type: string): Promise<VocabularyItem[]> {
  const data = await loadVocabularyByType(type);
  return data.terms || data.vocabulary || [];
}

/**
 * Lấy thông tin metadata cho một loại từ vựng
 */
export async function getTypeMetadata(type: string): Promise<VocabularyMetadata> {
  const data = await loadVocabularyByType(type);
  return data.metadata;
}

/**
 * Lấy tất cả từ vựng
 */
export async function getAllVocabulary(): Promise<VocabularyItem[]> {
  return loadAllVocabulary();
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

/**
 * Thêm một từ vựng mới
 */
export async function addVocabularyTerm(term: VocabularyItem): Promise<VocabularyItem> {
  try {
    const response = await fetch(`${API_URL}/vocabulary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(term),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add vocabulary term: ${response.status} ${response.statusText}`);
    }
    
    const addedTerm = await response.json() as VocabularyItem;
    
    // Xóa cache để buộc tải lại dữ liệu
    clearCache();
    
    return addedTerm;
  } catch (error) {
    console.error('Error adding vocabulary term:', error);
    throw error;
  }
}

/**
 * Cập nhật một từ vựng
 */
export async function updateVocabularyTerm(id: string, term: VocabularyItem): Promise<VocabularyItem> {
  try {
    const response = await fetch(`${API_URL}/vocabulary/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(term),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update vocabulary term: ${response.status} ${response.statusText}`);
    }
    
    const updatedTerm = await response.json() as VocabularyItem;
    
    // Xóa cache để buộc tải lại dữ liệu
    clearCache();
    
    return updatedTerm;
  } catch (error) {
    console.error('Error updating vocabulary term:', error);
    throw error;
  }
}

/**
 * Xóa một từ vựng
 */
export async function deleteVocabularyTerm(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/vocabulary/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete vocabulary term: ${response.status} ${response.statusText}`);
    }
    
    // Xóa cache để buộc tải lại dữ liệu
    clearCache();
    
    return true;
  } catch (error) {
    console.error('Error deleting vocabulary term:', error);
    throw error;
  }
} 