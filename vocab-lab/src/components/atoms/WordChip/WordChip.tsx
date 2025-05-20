import React from 'react';
import { Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../../../context/ThemeContext';

interface WordChipProps {
  term: string;
  onDelete: () => void;
}

export const WordChip: React.FC<WordChipProps> = ({ term, onDelete }) => {
  const { themeSettings } = useTheme();

  return (
    <Chip
      label={term}
      onDelete={onDelete}
      deleteIcon={<DeleteIcon />}
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