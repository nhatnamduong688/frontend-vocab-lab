import React, { useState, useEffect } from 'react';
import { Container, Grid, Box } from '@mui/material';
import VocabularyColumn from './components/VocabularyColumn';
import SelectedWords from './components/SelectedWords';
import { Vocabulary } from './types/vocabulary';

const App: React.FC = () => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedWords, setSelectedWords] = useState<Vocabulary[]>([]);

  useEffect(() => {
    fetch('/vocabulary.json')
      .then(response => response.json())
      .then(data => {
        // Transform the data to match our interface
        const transformedData = (Array.isArray(data.vocabulary) ? data.vocabulary : data).map((item: any, index: number) => ({
          ...item,
          id: item.id || `word-${index}`,
          difficulty: item.difficulty || 'medium',
          frequency: typeof item.frequency === 'number' ? item.frequency : 1
        }));
        setVocabulary(transformedData);
      })
      .catch(error => console.error('Error loading vocabulary:', error));
  }, []);

  const handleWordSelect = (word: Vocabulary) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (wordToRemove: string) => {
    setSelectedWords(prev => prev.filter(word => word.term !== wordToRemove));
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

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {/* Selected Words Section - Centered */}
      <Box sx={{ mb: 4 }}>
        <SelectedWords
          selectedWords={selectedWords}
          onRemoveWord={handleRemoveWord}
        />
      </Box>

      {/* Vocabulary Columns */}
      <Grid container spacing={2}>
        {Object.entries(vocabularyByType).map(([type, words]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={type}>
            <VocabularyColumn
              title={type}
              words={words}
              onWordSelect={handleWordSelect}
              selectedWords={selectedWords}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
