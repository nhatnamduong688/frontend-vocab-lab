import React from 'react';
import { Chip } from '@mui/material';
import { Vocabulary } from '../../../types/vocabulary';

interface VocabularyChipProps {
  word: Vocabulary;
  isSelected: boolean;
  onClick: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return '#4caf50';
    case 'medium':
      return '#ff9800';
    case 'hard':
      return '#f44336';
    default:
      return '#2196f3';
  }
};

export const VocabularyChip: React.FC<VocabularyChipProps> = ({
  word,
  isSelected,
  onClick,
}) => {
  return (
    <Chip
      label={word.term}
      onClick={onClick}
      sx={{
        m: 0.5,
        opacity: isSelected ? 0.5 : 1,
        bgcolor: getDifficultyColor(word.difficulty),
        color: 'white',
        '&:hover': {
          bgcolor: getDifficultyColor(word.difficulty),
          filter: 'brightness(90%)',
        },
        transition: 'all 0.2s ease',
      }}
    />
  );
}; 