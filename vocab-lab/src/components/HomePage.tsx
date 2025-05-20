import React from 'react';
import { Box, Grid } from '@mui/material';
import VocabularyColumn from './VocabularyColumn';
import SelectedWords from './SelectedWords';
import { Vocabulary } from '../types/vocabulary';

interface HomePageProps {
  selectedWords: Vocabulary[];
  vocabularyByType: Record<string, Vocabulary[]>;
  handleWordSelect: (word: Vocabulary) => void;
  handleRemoveWord: (term: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedWords,
  vocabularyByType,
  handleWordSelect,
  handleRemoveWord,
}) => {
  return (
    <Box sx={{ py: 3 }}>
      <SelectedWords
        selectedWords={selectedWords}
        onRemoveWord={handleRemoveWord}
      />
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          mt: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: '1400px'
        }}
      >
        {Object.entries(vocabularyByType).map(([type, words]) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={type}
            sx={{
              display: 'flex',
              alignItems: 'stretch'
            }}
          >
            <VocabularyColumn
              title={type}
              words={words}
              onWordSelect={handleWordSelect}
              selectedWords={selectedWords}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 