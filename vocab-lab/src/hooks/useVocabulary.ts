import { useState, useEffect, useCallback } from 'react';
import { 
  VocabularyItem, 
  VocabularyTypeInfo,
  DifficultyLevel,
  VocabularyType,
  Vocabulary
} from '../types/vocabulary';
import * as vocabularyService from '../services/vocabularyService';

interface VocabularyHookState {
  loading: boolean;
  loadingInfo: {
    types: boolean;
    vocabulary: boolean;
    message: string;
  };
  error: string | null;
  vocabularyData: VocabularyItem[];
  availableTypes: VocabularyTypeInfo[];
  filteredData: VocabularyItem[];
}

interface VocabularyHookFilters {
  types?: VocabularyType[];
  difficulty?: DifficultyLevel;
  searchText?: string;
}

export function useVocabulary() {
  const [state, setState] = useState<VocabularyHookState>({
    loading: true,
    loadingInfo: {
      types: true,
      vocabulary: true,
      message: 'Loading vocabulary data...'
    },
    error: null,
    vocabularyData: [],
    availableTypes: [],
    filteredData: [],
  });

  const [filters, setFilters] = useState<VocabularyHookFilters>({
    types: undefined,
    difficulty: undefined,
    searchText: '',
  });

  const [selectedWords, setSelectedWords] = useState<Vocabulary[]>([]);
  const [currentTypeFilter, setCurrentTypeFilter] = useState<string | null>(null);

  // Tải danh sách loại từ vựng có sẵn
  const loadAvailableTypes = useCallback(async () => {
    try {
      setState(prevState => ({
        ...prevState,
        loadingInfo: {
          ...prevState.loadingInfo,
          types: true,
          message: 'Loading vocabulary types...'
        },
        loading: true
      }));

      const types = await vocabularyService.getAvailableTypes();
      
      setState(prevState => ({
        ...prevState,
        availableTypes: types,
        loadingInfo: {
          ...prevState.loadingInfo,
          types: false,
          message: prevState.loadingInfo.vocabulary 
            ? 'Loading vocabulary data...' 
            : 'Ready'
        },
        loading: prevState.loadingInfo.vocabulary
      }));
    } catch (error) {
      console.error('Failed to load available types:', error);
      setState(prevState => ({
        ...prevState,
        error: 'Failed to load vocabulary types',
        loadingInfo: {
          ...prevState.loadingInfo,
          types: false,
          message: 'Error loading types'
        },
        loading: prevState.loadingInfo.vocabulary
      }));
    }
  }, []);

  // Tải dữ liệu từ vựng
  const loadVocabularyData = useCallback(async () => {
    setState(prevState => ({ 
      ...prevState, 
      loading: true, 
      error: null,
      loadingInfo: {
        ...prevState.loadingInfo,
        vocabulary: true,
        message: 'Loading vocabulary data...'
      }
    }));
    
    try {
      // Nếu có chỉ định loại cụ thể
      if (filters.types && filters.types.length > 0) {
        setState(prevState => ({
          ...prevState,
          loadingInfo: {
            ...prevState.loadingInfo,
            message: `Loading vocabulary for ${filters.types?.length} types...`
          }
        }));

        const typePromises = filters.types.map(type => 
          vocabularyService.getVocabularyByType(type)
        );
        const typeResults = await Promise.all(typePromises);
        const combinedData = typeResults.flat();
        
        setState(prevState => ({
          ...prevState,
          loading: false,
          loadingInfo: {
            ...prevState.loadingInfo,
            vocabulary: false,
            message: 'Ready'
          },
          vocabularyData: combinedData,
          filteredData: applyFilters(combinedData, filters),
        }));
      } else {
        // Tải tất cả các loại
        setState(prevState => ({
          ...prevState,
          loadingInfo: {
            ...prevState.loadingInfo,
            message: 'Loading all vocabulary data...'
          }
        }));

        const allData = await vocabularyService.getAllVocabulary();
        setState(prevState => ({
          ...prevState,
          loading: false,
          loadingInfo: {
            ...prevState.loadingInfo,
            vocabulary: false,
            message: 'Ready'
          },
          vocabularyData: allData,
          filteredData: applyFilters(allData, filters),
        }));
      }
    } catch (error) {
      console.error('Failed to load vocabulary data:', error);
      setState(prevState => ({
        ...prevState,
        loading: false,
        loadingInfo: {
          ...prevState.loadingInfo,
          vocabulary: false,
          message: 'Error loading vocabulary'
        },
        error: 'Failed to load vocabulary data',
      }));
    }
  }, [filters]);

  // Cập nhật bộ lọc
  const updateFilters = useCallback((newFilters: Partial<VocabularyHookFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Lọc dữ liệu dựa trên bộ lọc hiện tại
  const applyFilters = (data: VocabularyItem[], currentFilters: VocabularyHookFilters) => {
    return data.filter(item => {
      // Lọc theo loại
      if (currentFilters.types && currentFilters.types.length > 0 && 
          !currentFilters.types.includes(item.type as VocabularyType)) {
        return false;
      }
      
      // Lọc theo độ khó
      if (currentFilters.difficulty && item.difficulty !== currentFilters.difficulty) {
        return false;
      }
      
      // Lọc theo từ khóa tìm kiếm
      if (currentFilters.searchText && currentFilters.searchText.trim() !== '') {
        const searchLower = currentFilters.searchText.toLowerCase();
        return (
          item.term.toLowerCase().includes(searchLower) ||
          item.definition.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // Các hàm xử lý cần thiết cho HomePage cũ
  const handleWordSelect = useCallback((word: Vocabulary) => {
    // Kiểm tra nếu từ đã được chọn thì không thêm vào nữa
    setSelectedWords(prev => {
      // Kiểm tra nếu từ đã tồn tại trong danh sách
      const exists = prev.some(item => item.id === word.id);
      if (exists) return prev;
      return [...prev, word];
    });
  }, []);

  const handleRemoveWord = useCallback((term: string) => {
    setSelectedWords(prev => prev.filter(word => word.term !== term));
  }, []);

  // Xóa tất cả các từ đã chọn
  const clearWords = useCallback(() => {
    setSelectedWords([]);
  }, []);

  // Nhóm từ vựng theo loại (cần thiết cho HomePage cũ)
  const vocabularyByType = Object.fromEntries(
    state.availableTypes.map(typeInfo => [
      typeInfo.name,
      state.vocabularyData.filter(item => item.type === typeInfo.name)
    ])
  );

  // Cập nhật bộ lọc trên dữ liệu hiện có
  useEffect(() => {
    if (state.vocabularyData.length > 0) {
      const filtered = applyFilters(state.vocabularyData, filters);
      setState(prevState => ({
        ...prevState,
        filteredData: filtered,
      }));
    }
  }, [filters]);

  // Tải dữ liệu ban đầu
  useEffect(() => {
    loadAvailableTypes();
    loadVocabularyData();
  }, [loadAvailableTypes, loadVocabularyData]);

  return {
    loading: state.loading,
    loadingInfo: state.loadingInfo,
    error: state.error,
    vocabulary: state.filteredData,
    allVocabulary: state.vocabularyData,
    availableTypes: state.availableTypes,
    filters,
    updateFilters,
    refreshData: loadVocabularyData,
    // Các tính năng từ phiên bản cũ của hook
    selectedWords,
    handleWordSelect,
    handleRemoveWord,
    clearWords,
    setCurrentTypeFilter,
    vocabularyByType,
    currentTypeFilter
  };
} 