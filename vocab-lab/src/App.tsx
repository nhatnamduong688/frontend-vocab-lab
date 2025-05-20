import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/templates/MainLayout/MainLayout';
import { HomePage } from './components/pages/HomePage/HomePage';
import { SettingsPage } from './components/pages/SettingsPage/SettingsPage';
import { LoadingSpinner } from './components/atoms/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from './components/atoms/ErrorDisplay/ErrorDisplay';
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
        <MainLayout>
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
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
