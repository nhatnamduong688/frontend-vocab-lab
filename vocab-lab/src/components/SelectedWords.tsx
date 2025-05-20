import React from 'react';
import { Box, Paper, Typography, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Vocabulary } from '../types/vocabulary';

interface SelectedWordsProps {
  selectedWords: Vocabulary[];
  onRemoveWord: (term: string) => void;
}

const SelectedWords: React.FC<SelectedWordsProps> = ({
  selectedWords,
  onRemoveWord,
}) => {
  return (
    <Paper 
      elevation={3}
      sx={{
        p: 3,
        my: 4,
        minHeight: '200px',
        width: '80%',
        mx: 'auto',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center" color="primary">
        Sentence Formation
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          p: 2,
          minHeight: '100px',
          backgroundColor: 'white',
          borderRadius: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {selectedWords.length === 0 ? (
          <Typography color="text.secondary" align="center">
            Select words from the columns to form a sentence
          </Typography>
        ) : (
          selectedWords.map((word) => (
            <Chip
              key={word.term}
              label={word.term}
              onDelete={() => onRemoveWord(word.term)}
              deleteIcon={<DeleteIcon />}
              sx={{
                fontSize: '1.1rem',
                py: 2,
                px: 1,
                backgroundColor: '#e3f2fd',
                '&:hover': {
                  backgroundColor: '#bbdefb',
                }
              }}
            />
          ))
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          {selectedWords.map(word => word.term).join(' ')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SelectedWords; 