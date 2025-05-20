import { useState, useEffect, useCallback } from 'react';
import { 
  FlashcardSession, 
  FlashcardSettings, 
  FlashcardStatus,
  Flashcard
} from '../types/vocabulary';
import * as flashcardService from '../services/flashcardService';

interface UseFlashcardsReturn {
  // Current session
  session: FlashcardSession | null;
  loading: boolean;
  error: string | null;
  
  // Card status
  currentCard: Flashcard | null;
  isLastCard: boolean;
  isFirstCard: boolean;
  isSessionComplete: boolean;
  cardStatus: FlashcardStatus;
  
  // Actions
  startNewSession: (settings: FlashcardSettings) => Promise<void>;
  resetSession: () => Promise<void>;
  markCardCorrect: () => void;
  markCardIncorrect: () => void;
  skipCard: () => void;
  nextCard: () => void;
  previousCard: () => void;
  revealAnswer: () => void;
  
  // Session history
  allSessions: FlashcardSession[];
  deleteSession: (id: string) => void;
}

export function useFlashcards(initialSessionId?: string): UseFlashcardsReturn {
  const [session, setSession] = useState<FlashcardSession | null>(null);
  const [allSessions, setAllSessions] = useState<FlashcardSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cardStatus, setCardStatus] = useState<FlashcardStatus>('not-answered');
  
  // Load sessions
  const loadSessions = useCallback(() => {
    try {
      const sessions = flashcardService.getSessions();
      setAllSessions(sessions);
      return sessions;
    } catch (e) {
      setError('Failed to load flashcard sessions');
      return [];
    }
  }, []);
  
  // Initialize: load the specified session or the most recent one
  useEffect(() => {
    setLoading(true);
    try {
      const sessions = loadSessions();
      
      if (initialSessionId) {
        const initialSession = flashcardService.getSessionById(initialSessionId);
        if (initialSession) {
          setSession(initialSession);
        } else {
          setError(`Session with ID ${initialSessionId} not found`);
        }
      } else if (sessions.length > 0) {
        // Sort by date and get the most recent
        const sortedSessions = [...sessions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setSession(sortedSessions[0]);
      }
    } catch (e) {
      setError('Failed to initialize flashcard session');
    } finally {
      setLoading(false);
    }
  }, [initialSessionId, loadSessions]);
  
  // Start a new session
  const startNewSession = async (settings: FlashcardSettings) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await flashcardService.createSession(settings);
      setSession(newSession);
      setCardStatus('not-answered');
      loadSessions(); // Refresh the sessions list
    } catch (e) {
      setError('Failed to create new flashcard session');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset current session
  const resetSession = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      // Create new session with same settings
      const newSession = await flashcardService.createSession(session.settings);
      setSession(newSession);
      setCardStatus('not-answered');
      loadSessions(); // Refresh the sessions list
    } catch (e) {
      setError('Failed to reset flashcard session');
    } finally {
      setLoading(false);
    }
  };
  
  // Get current card
  const currentCard = session && session.cards.length > 0 
    ? session.cards[session.currentIndex] 
    : null;
  
  // Check if on first, last card, or if session is complete
  const isFirstCard = session ? session.currentIndex === 0 : false;
  const isLastCard = session 
    ? session.currentIndex === session.cards.length - 1 
    : false;
  const isSessionComplete = session 
    ? session.completedCardIds.length === session.cards.length
    : false;
  
  // Mark card as correct
  const markCardCorrect = () => {
    if (!session || !currentCard) return;
    
    const updatedSession = flashcardService.updateSessionProgress(
      session.id,
      currentCard.id,
      true
    );
    
    if (updatedSession) {
      setSession(updatedSession);
      setCardStatus('correct');
      loadSessions(); // Refresh the sessions list
    }
  };
  
  // Mark card as incorrect
  const markCardIncorrect = () => {
    if (!session || !currentCard) return;
    
    const updatedSession = flashcardService.updateSessionProgress(
      session.id,
      currentCard.id,
      false
    );
    
    if (updatedSession) {
      setSession(updatedSession);
      setCardStatus('incorrect');
      loadSessions(); // Refresh the sessions list
    }
  };
  
  // Skip current card
  const skipCard = () => {
    if (!session || !currentCard) return;
    
    if (session.currentIndex < session.cards.length - 1) {
      const updatedSession = { 
        ...session, 
        currentIndex: session.currentIndex + 1,
      };
      
      flashcardService.saveSession(updatedSession);
      setSession(updatedSession);
      setCardStatus('not-answered');
      loadSessions(); // Refresh the sessions list
    }
  };
  
  // Move to next card
  const nextCard = () => {
    if (!session) return;
    
    if (session.currentIndex < session.cards.length - 1) {
      const updatedSession = { 
        ...session, 
        currentIndex: session.currentIndex + 1
      };
      
      flashcardService.saveSession(updatedSession);
      setSession(updatedSession);
      setCardStatus('not-answered');
    }
  };
  
  // Move to previous card
  const previousCard = () => {
    if (!session) return;
    
    if (session.currentIndex > 0) {
      const updatedSession = { 
        ...session, 
        currentIndex: session.currentIndex - 1
      };
      
      flashcardService.saveSession(updatedSession);
      setSession(updatedSession);
      setCardStatus('not-answered');
    }
  };
  
  // Reveal answer without marking it
  const revealAnswer = () => {
    setCardStatus('skipped');
  };
  
  // Delete a session
  const handleDeleteSession = (id: string) => {
    flashcardService.deleteSession(id);
    
    // If deleting current session, reset
    if (session && session.id === id) {
      setSession(null);
    }
    
    // Refresh session list
    loadSessions();
  };
  
  return {
    session,
    loading,
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
    skipCard,
    nextCard,
    previousCard,
    revealAnswer,
    allSessions,
    deleteSession: handleDeleteSession,
  };
} 