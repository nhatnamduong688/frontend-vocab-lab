import React, { useState, useMemo } from 'react';
import { 
  Paper, 
  Typography, 
  Box,
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

export const VocabularyColumn: React.FC<VocabularyColumnProps> = ({
  title,
  words,
  selectedWords,
  onWordSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

  const isWordSelected = (word: Vocabulary) => {
    return selectedWords.some(selected => selected.term === word.term);
  };

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
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
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

      {/* Words Grid with Scroll */}
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
          <VocabularyChip
            key={word.id}
            word={word}
            isSelected={isWordSelected(word)}
            onClick={() => !isWordSelected(word) && onWordSelect(word)}
          />
        ))}
      </Box>
    </Paper>
  );
}; 