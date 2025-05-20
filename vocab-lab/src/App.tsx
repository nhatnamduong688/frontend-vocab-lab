import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './components/templates/MainLayout/MainLayout';
import { HomePage } from './components/pages/HomePage/HomePage';
import { SettingsPage } from './components/pages/SettingsPage/SettingsPage';
import { LoadingSpinner } from './components/atoms/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from './components/atoms/ErrorDisplay/ErrorDisplay';
import { useVocabulary } from './hooks/useVocabulary';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const {
    selectedWords,
    loading,
    error,
    vocabularyByType,
    availableTypes = [], // Provide default empty array
    currentTypeFilter,
    handleWordSelect,
    handleRemoveWord,
    setCurrentTypeFilter,
    refreshVocabulary
  } = useVocabulary();

  // Log state for debugging
  useEffect(() => {
    console.log('Current state:', {
      availableTypes,
      currentTypeFilter,
      vocabularyTypes: Object.keys(vocabularyByType || {})
    });
  }, [availableTypes, currentTypeFilter, vocabularyByType]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                selectedWords={selectedWords || []}
                vocabularyByType={vocabularyByType || {}}
                availableTypes={availableTypes}
                currentTypeFilter={currentTypeFilter}
                handleWordSelect={handleWordSelect}
                handleRemoveWord={handleRemoveWord}
                setCurrentTypeFilter={setCurrentTypeFilter}
                refreshVocabulary={refreshVocabulary}
              />
            } 
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
