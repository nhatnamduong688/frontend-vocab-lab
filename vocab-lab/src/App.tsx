import React from 'react';
import { Container, Grid, Box, Typography, ThemeProvider, CssBaseline } from '@mui/material';
import VocabularyColumn from './components/VocabularyColumn';
import SelectedWords from './components/SelectedWords';
import { useVocabulary } from './hooks/useVocabulary';
import { theme } from './theme';

const App: React.FC = () => {
  const {
    selectedWords,
    loading,
    error,
    vocabularyByType,
    handleWordSelect,
    handleRemoveWord,
  } = useVocabulary();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
            {/* Selected Words Section */}
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
