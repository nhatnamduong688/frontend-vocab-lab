import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Collapse,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  QuestionAnswer as QuestionIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { VocabularyItem } from '../types/vocabulary';

// Color mapping based on difficulty
const difficultyColorMap: Record<string, string> = {
  easy: '#4caf50',
  medium: '#ff9800',
  hard: '#f44336'
};

// Color mapping based on type
const typeColorMap: Record<string, string> = {
  noun: '#2196f3',
  verb: '#9c27b0',
  adjective: '#3f51b5',
  adverb: '#00bcd4',
  other: '#607d8b'
};

interface VocabularyCardProps {
  vocabulary: VocabularyItem;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ vocabulary }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" component="div">
            {vocabulary.term}
          </Typography>
          <Chip 
            label={vocabulary.type} 
            size="small"
            sx={{ 
              backgroundColor: typeColorMap[vocabulary.type] || typeColorMap.other,
              color: 'white'
            }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {vocabulary.definition}
        </Typography>
        
        <Box display="flex" gap={1} mt={2}>
          <Tooltip title="Difficulty Level">
            <Chip 
              label={vocabulary.difficulty} 
              size="small" 
              sx={{ 
                backgroundColor: difficultyColorMap[vocabulary.difficulty] || difficultyColorMap.medium,
                color: 'white'
              }}
            />
          </Tooltip>
          
          <Tooltip title="Importance in Interviews">
            <Chip 
              label={vocabulary.interviewImportance} 
              size="small" 
              variant="outlined"
            />
          </Tooltip>
          
          <Tooltip title="Usage Frequency">
            <Chip 
              label={`${vocabulary.frequency}%`} 
              size="small" 
              variant="outlined"
            />
          </Tooltip>
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions disableSpacing>
        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {vocabulary.category}
          </Typography>
          
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </CardActions>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {vocabulary.description}
          </Typography>
          
          <Typography variant="subtitle2" gutterBottom>
            Example:
          </Typography>
          <Typography paragraph color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {vocabulary.example}
          </Typography>
          
          {vocabulary.codeExample && (
            <>
              <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
                <CodeIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2">
                  Code Example:
                </Typography>
              </Box>
              <Box 
                component="pre" 
                sx={{ 
                  backgroundColor: '#f5f5f5', 
                  p: 1, 
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem',
                  maxHeight: '150px'
                }}
              >
                <code>{vocabulary.codeExample}</code>
              </Box>
            </>
          )}
          
          {vocabulary.relatedTerms && vocabulary.relatedTerms.length > 0 && (
            <>
              <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
                <LinkIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2">
                  Related Terms:
                </Typography>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {vocabulary.relatedTerms.map((term, index) => (
                  <Chip key={index} label={term} size="small" variant="outlined" />
                ))}
              </Box>
            </>
          )}
          
          {vocabulary.commonQuestions && vocabulary.commonQuestions.length > 0 && (
            <>
              <Box display="flex" alignItems="center" gap={1} mt={2} mb={1}>
                <QuestionIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2">
                  Common Questions:
                </Typography>
              </Box>
              <List dense disablePadding>
                {vocabulary.commonQuestions.map((question, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText 
                      primary={question}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default VocabularyCard; 