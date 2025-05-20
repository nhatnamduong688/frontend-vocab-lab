import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  Tooltip,
  IconButton,
  InputAdornment,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { Vocabulary } from '../types/vocabulary';

interface VocabularyColumnProps {
  title: string;
  words: Vocabulary[];
  onWordSelect: (word: Vocabulary) => void;
  selectedWords: Vocabulary[];
}

const VocabularyColumn: React.FC<VocabularyColumnProps> = ({
  title,
  words,
  onWordSelect,
  selectedWords
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = words.filter(word =>
    word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isWordSelected = (word: Vocabulary) => 
    selectedWords.some(selected => selected.id === word.id);

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          px: 2,
          py: 1.5,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
          {title}
        </Typography>
        <Chip 
          label={filteredWords.length}
          size="small"
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white',
            height: '24px',
            '& .MuiChip-label': {
              px: 1,
              fontSize: '0.75rem',
            }
          }}
        />
      </Box>

      {/* Search Box */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.default',
              '&:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                }
              }
            }
          }}
        />
      </Box>

      {/* Words List */}
      <List 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          px: 1,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'background.default',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'action.hover',
            borderRadius: '3px',
          },
        }}
      >
        {filteredWords.map((word) => (
          <ListItem
            key={word.id}
            disablePadding
            sx={{
              mb: 0.5,
              bgcolor: isWordSelected(word) ? 'primary.light' : 'background.paper',
              borderRadius: 1,
              '&:hover': {
                bgcolor: isWordSelected(word) ? 'primary.light' : 'action.hover',
              },
            }}
          >
            <ListItemButton
              onClick={() => !isWordSelected(word) && onWordSelect(word)}
              disabled={isWordSelected(word)}
              sx={{ 
                py: 1,
                px: 2,
                borderRadius: 1,
              }}
            >
              <ListItemText
                primary={word.term}
                secondary={
                  <>
                    <Typography 
                      variant="body2" 
                      component="span" 
                      color={isWordSelected(word) ? 'white' : 'text.primary'}
                      sx={{ display: 'block', mb: 0.5 }}
                    >
                      {word.definition}
                    </Typography>
                    {word.example && (
                      <Typography 
                        variant="caption" 
                        display="block" 
                        color={isWordSelected(word) ? 'white' : 'text.secondary'}
                      >
                        Example: {word.example}
                      </Typography>
                    )}
                  </>
                }
                primaryTypographyProps={{
                  fontWeight: isWordSelected(word) ? 600 : 500,
                  color: isWordSelected(word) ? 'white' : 'text.primary',
                  sx: { mb: 0.5 }
                }}
              />
              <Tooltip 
                title={
                  <Box sx={{ p: 0.5 }}>
                    <Typography variant="caption" display="block">Type: {word.type}</Typography>
                    <Typography variant="caption" display="block">Difficulty: {word.difficulty}</Typography>
                    <Typography variant="caption" display="block">Frequency: {word.frequency}</Typography>
                  </Box>
                }
              >
                <IconButton 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    color: isWordSelected(word) ? 'white' : 'action.active',
                  }}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default VocabularyColumn; 