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
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
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
      elevation={3} 
      sx={{ 
        height: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {filteredWords.map((word) => (
          <ListItem
            key={word.id}
            disablePadding
            sx={{
              bgcolor: isWordSelected(word) ? 'action.selected' : 'inherit'
            }}
          >
            <ListItemButton
              onClick={() => !isWordSelected(word) && onWordSelect(word)}
              disabled={isWordSelected(word)}
            >
              <ListItemText
                primary={word.term}
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      {word.definition}
                    </Typography>
                    {word.example && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Example: {word.example}
                      </Typography>
                    )}
                  </>
                }
                primaryTypographyProps={{
                  fontWeight: isWordSelected(word) ? 'bold' : 'normal'
                }}
              />
              <Tooltip title={`Type: ${word.type}\nDifficulty: ${word.difficulty}\nFrequency: ${word.frequency}`}>
                <IconButton size="small">
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