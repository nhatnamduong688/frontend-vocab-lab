import { 
  VocabularyItem, 
  Flashcard, 
  FlashcardSettings, 
  FlashcardSession, 
  FlashcardMode, 
  DifficultyLevel 
} from '../types/vocabulary';
import * as vocabularyService from './vocabularyService';

const LOCAL_STORAGE_KEY = 'flashcard-sessions';

/**
 * Convert vocabulary items to flashcards
 */
export function convertToFlashcards(items: VocabularyItem[]): Flashcard[] {
  return items.map(item => ({
    id: item.id,
    term: item.term,
    definition: item.definition,
    example: item.example,
    codeExample: item.codeExample,
    type: item.type,
    difficulty: item.difficulty
  }));
}

/**
 * Generate a set of flashcards based on provided settings
 */
export async function generateFlashcards(settings: FlashcardSettings): Promise<Flashcard[]> {
  // Fetch vocabulary based on settings
  let vocabularyItems: VocabularyItem[] = [];
  
  if (settings.filterByTypes && settings.filterByTypes.length > 0) {
    // Fetch only specific types
    const promises = settings.filterByTypes.map(type => 
      vocabularyService.getVocabularyByType(type)
    );
    const results = await Promise.all(promises);
    vocabularyItems = results.flat();
  } else {
    // Fetch all vocabulary
    vocabularyItems = await vocabularyService.getAllVocabulary();
  }
  
  // Apply difficulty filter if provided
  if (settings.filterByDifficulty && settings.filterByDifficulty.length > 0) {
    vocabularyItems = vocabularyItems.filter(item => 
      settings.filterByDifficulty?.includes(item.difficulty as DifficultyLevel)
    );
  }
  
  // Convert to flashcards
  let flashcards = convertToFlashcards(vocabularyItems);
  
  // Shuffle the array
  flashcards = shuffleArray(flashcards);
  
  // Limit count if specified
  if (settings.limitCount && settings.limitCount > 0 && settings.limitCount < flashcards.length) {
    flashcards = flashcards.slice(0, settings.limitCount);
  }
  
  return flashcards;
}

/**
 * Create a new flashcard session
 */
export async function createSession(settings: FlashcardSettings): Promise<FlashcardSession> {
  const cards = await generateFlashcards(settings);
  
  const session: FlashcardSession = {
    id: `session_${Date.now()}`,
    date: new Date().toISOString(),
    settings,
    cards,
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    completedCardIds: []
  };
  
  // Save session to localStorage
  saveSession(session);
  
  return session;
}

/**
 * Save session to localStorage
 */
export function saveSession(session: FlashcardSession): void {
  try {
    const sessions = getSessions();
    
    // Replace if exists or add new
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving flashcard session:', error);
  }
}

/**
 * Get all flashcard sessions from localStorage
 */
export function getSessions(): FlashcardSession[] {
  try {
    const sessionsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!sessionsJson) return [];
    return JSON.parse(sessionsJson);
  } catch (error) {
    console.error('Error retrieving flashcard sessions:', error);
    return [];
  }
}

/**
 * Get a specific session by ID
 */
export function getSessionById(id: string): FlashcardSession | null {
  const sessions = getSessions();
  return sessions.find(session => session.id === id) || null;
}

/**
 * Delete a session by ID
 */
export function deleteSession(id: string): boolean {
  try {
    const sessions = getSessions();
    const filteredSessions = sessions.filter(session => session.id !== id);
    
    // If no change, session not found
    if (filteredSessions.length === sessions.length) {
      return false;
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredSessions));
    return true;
  } catch (error) {
    console.error('Error deleting flashcard session:', error);
    return false;
  }
}

/**
 * Update session progress
 */
export function updateSessionProgress(
  sessionId: string, 
  cardId: string, 
  isCorrect: boolean
): FlashcardSession | null {
  const session = getSessionById(sessionId);
  if (!session) return null;
  
  // Mark card as completed
  if (!session.completedCardIds.includes(cardId)) {
    session.completedCardIds.push(cardId);
  }
  
  // Update counts
  if (isCorrect) {
    session.correctCount += 1;
  } else {
    session.incorrectCount += 1;
  }
  
  // Move to next card if not at the end
  if (session.currentIndex < session.cards.length - 1) {
    session.currentIndex += 1;
  }
  
  // Save updated session
  saveSession(session);
  return session;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
} 