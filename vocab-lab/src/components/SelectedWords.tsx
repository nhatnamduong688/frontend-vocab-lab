import React from 'react';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
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
      elevation={2}
      sx={{
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto',
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
          Sentence Formation
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {/* Instructions */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            align="center"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Select words from the columns below to form your sentence. Click on any word to remove it.
          </Typography>

          {/* Selected Words Area */}
          <Paper 
            variant="outlined"
            sx={{ 
              p: { xs: 2, sm: 3 },
              minHeight: '100px',
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            {/* Words Container */}
            <Box 
              sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
                justifyContent: selectedWords.length ? 'flex-start' : 'center',
                minHeight: '50px'
              }}
            >
              {selectedWords.length === 0 ? (
                <Typography color="text.secondary" variant="body1">
                  Your selected words will appear here
                </Typography>
              ) : (
                selectedWords.map((word) => (
                  <Chip
                    key={word.id}
                    label={word.term}
                    onDelete={() => onRemoveWord(word.term)}
                    deleteIcon={<DeleteIcon />}
                    sx={{
                      fontSize: '1rem',
                      py: 2.5,
                      bgcolor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      },
                      '& .MuiChip-label': {
                        px: 2,
                      },
                      '& .MuiChip-deleteIcon': {
                        color: 'white',
                      }
                    }}
                  />
                ))
              )}
            </Box>

            {/* Sentence Preview */}
            {selectedWords.length > 0 && (
              <Box sx={{ 
                mt: 3,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography 
                  variant="body1" 
                  color="text.primary" 
                  sx={{ 
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    textAlign: 'center'
                  }}
                >
                  {selectedWords.map(word => word.term).join(' ')}
                </Typography>
              </Box>
            )}
          </Paper>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SelectedWords; 