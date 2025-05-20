import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { useVocabulary } from './hooks/useVocabulary';

function App() {
  const {
    selectedWords,
    loading,
    error,
    vocabularyByType,
    handleWordSelect,
    handleRemoveWord,
  } = useVocabulary();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <ThemeProvider>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <Navigation />
          <Container>
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage
                    selectedWords={selectedWords}
                    vocabularyByType={vocabularyByType}
                    handleWordSelect={handleWordSelect}
                    handleRemoveWord={handleRemoveWord}
                  />
                } 
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
