import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { Vocabulary } from '../../../types/vocabulary';
import { useTheme } from '../../../context/ThemeContext';

interface VocabularyChipProps {
  word: Vocabulary;
  isSelected: boolean;
  onClick: () => void;
}

export const VocabularyChip: React.FC<VocabularyChipProps> = ({
  word,
  isSelected,
  onClick,
}) => {
  const { themeSettings } = useTheme();
  
  const getChipColor = () => {
    const colorMap = themeSettings.difficultyColors;
    return colorMap[word.difficulty] || themeSettings.defaultColor;
  };

  return (
    <Tooltip 
      title={word.definition} 
      arrow
      placement="top"
    >
      <Chip
        label={word.term}
        onClick={onClick}
        sx={{
          m: 0.5,
          opacity: isSelected ? 0.5 : 1,
          bgcolor: getChipColor(),
          color: themeSettings.selectedWordTextColor,
          '&:hover': {
            bgcolor: getChipColor(),
            filter: 'brightness(90%)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease',
          borderRadius: '16px',
          fontSize: '0.9rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />
    </Tooltip>
  );
}; 