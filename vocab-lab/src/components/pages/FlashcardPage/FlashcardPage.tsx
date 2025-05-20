import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';
import { useFlashcards } from '../../../hooks/useFlashcards';
import { useVocabulary } from '../../../hooks/useVocabulary';
import FlashcardView from '../../FlashcardView';
import FlashcardSettings from '../../FlashcardSettings';
import FlashcardSessionSummary from '../../FlashcardSessionSummary';

const FlashcardPage: React.FC = () => {
  const [showSettings, setShowSettings] = useState(true);
  const { availableTypes, loading: loadingVocabulary } = useVocabulary();
  
  const {
    session,
    loading: loadingFlashcards,
    error,
    currentCard,
    isLastCard,
    isFirstCard,
    isSessionComplete,
    cardStatus,
    startNewSession,
    resetSession,
    markCardCorrect,
    markCardIncorrect,
    nextCard,
    previousCard,
    revealAnswer,
  } = useFlashcards();
  
  const loading = loadingVocabulary || loadingFlashcards;
  
  // Start a new session and hide settings
  const handleStartSession = async (settings: any) => {
    await startNewSession(settings);
    setShowSettings(false);
  };
  
  // Reset to settings view
  const handleBackToSettings = () => {
    setShowSettings(true);
  };
  
  // Render loading state
  if (loading && !showSettings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error && !showSettings) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={handleBackToSettings}
          startIcon={<SettingsIcon />}
        >
          Back to Settings
        </Button>
      </Container>
    );
  }
  
  // Render settings
  if (showSettings) {
    return (
      <Container maxWidth="md">
        <FlashcardSettings 
          availableTypes={availableTypes}
          onStartSession={handleStartSession}
          loading={loading}
        />
      </Container>
    );
  }
  
  // Render session complete view
  if (isSessionComplete || !session || !currentCard) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {session && (
          <FlashcardSessionSummary 
            session={session} 
            onReset={resetSession} 
            onNewSession={handleBackToSettings} 
          />
        )}
        
        {!session && (
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              No Active Flashcard Session
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleBackToSettings}
              startIcon={<SettingsIcon />}
              sx={{ mt: 2 }}
            >
              Create New Session
            </Button>
          </Paper>
        )}
      </Container>
    );
  }
  
  // Render flashcard view
  return (
    <Container maxWidth="md">
      <FlashcardView
        card={currentCard}
        mode={session.settings.mode}
        cardStatus={cardStatus}
        isFirst={isFirstCard}
        isLast={isLastCard}
        showExample={session.settings.showExamples}
        showCodeExample={session.settings.showCodeExamples}
        onCorrect={markCardCorrect}
        onIncorrect={markCardIncorrect}
        onNext={nextCard}
        onPrevious={previousCard}
        onReveal={revealAnswer}
      />
      
      <Divider sx={{ my: 3 }} />
      
      <Box display="flex" justifyContent="space-between">
        <Button 
          variant="outlined" 
          onClick={handleBackToSettings}
          startIcon={<SettingsIcon />}
        >
          Settings
        </Button>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Card {session.currentIndex + 1} of {session.cards.length}
          </Typography>
          
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={resetSession}
            startIcon={<ReplayIcon />}
          >
            Reset Session
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default FlashcardPage; 