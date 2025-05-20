export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const VOCABULARY_TYPES = {
  NOUN: 'noun',
  VERB: 'verb',
  ADJECTIVE: 'adjective',
  ADVERB: 'adverb',
  OTHER: 'other',
} as const;

export const DEFAULT_VALUES = {
  FREQUENCY: 1,
  DIFFICULTY: DIFFICULTY_LEVELS.MEDIUM,
  TYPE: VOCABULARY_TYPES.OTHER,
} as const;

export const UI_CONSTANTS = {
  COLUMN_HEIGHT: '600px',
  MAX_CONTAINER_WIDTH: '1400px',
  SCROLLBAR_WIDTH: '6px',
  BORDER_RADIUS: '8px',
} as const;

export const ERROR_MESSAGES = {
  LOAD_FAILED: 'Failed to load vocabulary',
  NO_DATA: 'No vocabulary data available',
} as const; 