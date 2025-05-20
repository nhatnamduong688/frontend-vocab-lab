import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import VocabularyColumn from './components/VocabularyColumn';
import SelectedWords from './components/SelectedWords';
import { Vocabulary } from './types/vocabulary';

// Create a theme with better spacing and colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    }
  },
  typography: {
    h4: {
      fontWeight: 600,
      color: '#1976d2',
    },
    h6: {
      fontWeight: 500,
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 3
      }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom 
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            Vocabulary Lab
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Selected Words Section - Centered */}
            <SelectedWords
              selectedWords={selectedWords}
              onRemoveWord={handleRemoveWord}
            />

            {/* Vocabulary Columns */}
            <Grid 
              container 
              spacing={2} 
              sx={{ 
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
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
