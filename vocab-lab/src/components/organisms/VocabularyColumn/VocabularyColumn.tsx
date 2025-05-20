import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { Vocabulary } from '../../../types/vocabulary';

interface VocabularyColumnProps {
  title: string;
  words: Vocabulary[];
  selectedWords: Vocabulary[];
  onWordSelect: (word: Vocabulary) => void;
}

export const VocabularyColumn: React.FC<VocabularyColumnProps> = ({
  title,
  words,
  selectedWords,
  onWordSelect,
}) => {
  const isWordSelected = (word: Vocabulary) => {
    return selectedWords.some(selected => selected.term === word.term);
  };

  return (
    <Paper 
      elevation={2}
      sx={{ 
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Word List */}
      <List sx={{ p: 0 }}>
        {words.map((word) => (
          <ListItem
            key={word.id}
            button
            onClick={() => !isWordSelected(word) && onWordSelect(word)}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 2,
              opacity: isWordSelected(word) ? 0.5 : 1,
              '&:hover': {
                bgcolor: isWordSelected(word) ? 'transparent' : 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={word.term}
              secondary={word.definition}
              primaryTypographyProps={{
                sx: {
                  fontWeight: 500,
                  mb: 0.5,
                }
              }}
              secondaryTypographyProps={{
                sx: {
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 