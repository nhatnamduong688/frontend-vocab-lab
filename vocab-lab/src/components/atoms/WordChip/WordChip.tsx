import React from 'react';
import { Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../../../context/ThemeContext';
import { Vocabulary } from '../../../types/vocabulary';

interface WordChipProps {
  word: Vocabulary;
  onDelete?: () => void;
}

export const WordChip: React.FC<WordChipProps> = ({ word, onDelete }) => {
  const { themeSettings } = useTheme();

  return (
    <Chip
      label={word.term}
      onDelete={onDelete}
      deleteIcon={onDelete && <DeleteIcon />}
      sx={{
        fontSize: '1rem',
        py: 2.5,
        bgcolor: themeSettings.selectedWordBgColor,
        color: themeSettings.selectedWordTextColor,
        '&:hover': {
          bgcolor: themeSettings.selectedWordBgColor,
          filter: 'brightness(90%)',
        },
        '& .MuiChip-label': {
          px: 2,
        },
        '& .MuiChip-deleteIcon': {
          color: themeSettings.selectedWordTextColor,
        }
      }}
    />
  );
}; 