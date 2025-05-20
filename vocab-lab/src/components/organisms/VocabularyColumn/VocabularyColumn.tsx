import React, { useState, useCallback, useMemo, memo } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  useTheme,
} from '@mui/material';
import { Vocabulary } from '../../../types/vocabulary';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { SortSelect, SortOption } from '../../molecules/SortSelect/SortSelect';
import { VocabularyChip } from '../../molecules/VocabularyChip/VocabularyChip';

interface VocabularyColumnProps {
  title: string;
  words: Vocabulary[];
  selectedWords: Vocabulary[];
  onWordSelect: (word: Vocabulary) => void;
}

// Tối ưu chip từ vựng với memo để tránh re-render không cần thiết
const MemoizedVocabularyChip = memo(({ 
  word, 
  isSelected, 
  onClick 
}: { 
  word: Vocabulary;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <VocabularyChip
    word={word}
    isSelected={isSelected}
    onClick={onClick}
  />
), (prevProps, nextProps) => {
  return prevProps.word.id === nextProps.word.id && 
         prevProps.isSelected === nextProps.isSelected;
});

MemoizedVocabularyChip.displayName = 'MemoizedVocabularyChip';

export const VocabularyColumn: React.FC<VocabularyColumnProps> = ({
  title,
  words,
  selectedWords,
  onWordSelect,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  // Sử dụng useMemo để tối ưu việc kiểm tra từ nào đã được chọn
  const selectedWordIds = useMemo(() => {
    return new Set(selectedWords.map(word => word.id));
  }, [selectedWords]);

  // Tối ưu hàm xử lý khi click vào từ
  const handleWordClick = useCallback((word: Vocabulary) => {
    return () => {
      onWordSelect(word);
    };
  }, [onWordSelect]);

  const filteredAndSortedWords = useMemo(() => {
    let result = [...words];
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(word => 
        word.term.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.term.localeCompare(b.term);
        case 'level':
          return a.difficulty.localeCompare(b.difficulty);
        case 'recent':
          return (b.frequency || 0) - (a.frequency || 0);
        default:
          return 0;
      }
    });
    
    return result;
  }, [words, searchTerm, sortBy]);

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Search and Sort */}
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search words..."
      />
      <SortSelect
        value={sortBy}
        onChange={setSortBy}
      />

      {/* Words Grid with Scroll - Keep the grid layout but optimize it */}
      <Box 
        sx={{ 
          p: 2,
          flexGrow: 1,
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          gap: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
        }}
      >
        {filteredAndSortedWords.map((word) => (
          <MemoizedVocabularyChip
            key={word.id}
            word={word}
            isSelected={selectedWordIds.has(word.id)}
            onClick={handleWordClick(word)}
          />
        ))}
      </Box>
    </Paper>
  );
}; 