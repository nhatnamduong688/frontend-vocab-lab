import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { MainLayout } from './components/templates/MainLayout/MainLayout';
import { HomePage } from './components/pages/HomePage/HomePage';
import { SettingsPage } from './components/pages/SettingsPage/SettingsPage';
import { SavedSentencesPage } from './components/pages/SavedSentencesPage/SavedSentencesPage';
import { LoadingSpinner } from './components/atoms/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from './components/atoms/ErrorDisplay/ErrorDisplay';
import VocabularyByType from './components/VocabularyByType';
import { useVocabulary } from './hooks/useVocabulary';
import FlashcardPage from './components/pages/FlashcardPage/FlashcardPage';

function App() {
  return (
    <ThemeProvider>
      <ConnectionProvider>
        <AppContent />
      </ConnectionProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const {
    loading,
    error,
    vocabulary,
    allVocabulary,
    availableTypes,
    selectedWords,
    handleWordSelect,
    handleRemoveWord,
    clearWords,
    setCurrentTypeFilter,
    refreshData,
    vocabularyByType
  } = useVocabulary();

  if (loading && !vocabulary.length) {
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
                availableTypes={availableTypes.map(t => t.name)}
                currentTypeFilter={null}
                handleWordSelect={handleWordSelect}
                handleRemoveWord={handleRemoveWord}
                setCurrentTypeFilter={setCurrentTypeFilter}
                refreshVocabulary={refreshData}
                clearWords={clearWords}
              />
            } 
          />
          <Route path="/explore" element={<VocabularyByType />} />
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/saved-sentences" element={<SavedSentencesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
