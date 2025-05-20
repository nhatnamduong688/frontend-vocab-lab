import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Fade,
  Grow,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Check as CorrectIcon,
  Close as IncorrectIcon,
  Refresh as ResetIcon,
  VisibilityOff as HideIcon,
  Visibility as ShowIcon,
} from '@mui/icons-material';
import { Flashcard, FlashcardStatus, FlashcardMode } from '../types/vocabulary';

const difficultyColorMap: Record<string, string> = {
  easy: '#4caf50',
  medium: '#ff9800',
  hard: '#f44336'
};

interface FlashcardViewProps {
  card: Flashcard;
  mode: FlashcardMode;
  cardStatus: FlashcardStatus;
  isFirst: boolean;
  isLast: boolean;
  showExample: boolean;
  showCodeExample: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReveal: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({
  card,
  mode,
  cardStatus,
  isFirst,
  isLast,
  showExample,
  showCodeExample,
  onCorrect,
  onIncorrect,
  onNext,
  onPrevious,
  onReveal,
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (cardStatus === 'not-answered') {
      onReveal();
    }
    setFlipped(!flipped);
  };

  // Determine what to show on front and back based on mode
  const getFrontContent = () => {
    if (mode === 'term-to-definition' || (mode === 'mixed' && Math.random() > 0.5)) {
      return card.term;
    } else {
      return card.definition;
    }
  };

  const getBackContent = () => {
    if (mode === 'term-to-definition' || (mode === 'mixed' && getFrontContent() === card.term)) {
      return card.definition;
    } else {
      return card.term;
    }
  };

  const frontContent = getFrontContent();
  const backContent = getBackContent();
  const showingTerm = frontContent === card.term;

  // Get result indicator based on status
  const getResultIndicator = () => {
    switch (cardStatus) {
      case 'correct':
        return (
          <Chip
            icon={<CorrectIcon />}
            label="Correct"
            color="success"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          />
        );
      case 'incorrect':
        return (
          <Chip
            icon={<IncorrectIcon />}
            label="Incorrect"
            color="error"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          />
        );
      case 'skipped':
        return (
          <Chip
            label="Skipped"
            color="default"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="overline">
              {showingTerm ? 'Term to Definition' : 'Definition to Term'}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip 
                size="small"
                label={card.type}
                color="primary"
                variant="outlined"
              />
              <Chip 
                size="small"
                label={card.difficulty}
                sx={{ 
                  backgroundColor: difficultyColorMap[card.difficulty], 
                  color: 'white'
                }}
              />
            </Stack>
          </Box>
          <IconButton onClick={handleFlip}>
            {flipped ? <HideIcon /> : <ShowIcon />}
          </IconButton>
        </Box>
      </Paper>

      <Card 
        raised 
        sx={{ 
          height: 350, 
          position: 'relative',
          borderRadius: 3,
          cursor: 'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: flipped ? '#f5f5f5' : 'white',
        }}
        onClick={handleFlip}
      >
        <CardContent sx={{ width: '100%', height: '100%', p: 4 }}>
          {/* Result indicator */}
          {getResultIndicator()}
          
          {/* Front content */}
          <Fade in={!flipped} timeout={300}>
            <Box
              sx={{
                display: flipped ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 2,
              }}
            >
              <Typography 
                variant="h4" 
                component="div" 
                align="center" 
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                {frontContent}
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ mt: 2 }}
              >
                Click to reveal {showingTerm ? 'definition' : 'term'}
              </Typography>
            </Box>
          </Fade>

          {/* Back content */}
          <Grow in={flipped} timeout={300}>
            <Box
              sx={{
                display: !flipped ? 'none' : 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: '100%',
                overflow: 'auto',
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {backContent}
              </Typography>

              {showExample && card.example && (
                <Box mt={2} width="100%">
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Example:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    {card.example}
                  </Typography>
                </Box>
              )}

              {showCodeExample && card.codeExample && (
                <Box mt={2} width="100%">
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Code Example:
                  </Typography>
                  <Box 
                    component="pre" 
                    sx={{ 
                      backgroundColor: '#f0f0f0', 
                      p: 2, 
                      borderRadius: 1,
                      overflow: 'auto',
                      fontSize: '0.875rem'
                    }}
                  >
                    <code>{card.codeExample}</code>
                  </Box>
                </Box>
              )}
            </Box>
          </Grow>
        </CardContent>
      </Card>

      {/* Navigation and scoring buttons */}
      <Box 
        mt={3}
        display="flex" 
        justifyContent="space-between"
        alignItems="center"
      >
        <IconButton 
          disabled={isFirst} 
          onClick={onPrevious}
          size="large"
          color="primary"
        >
          <PrevIcon fontSize="large" />
        </IconButton>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CorrectIcon />}
            onClick={onCorrect}
            disabled={cardStatus !== 'not-answered' && cardStatus !== 'skipped'}
          >
            Correct
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<IncorrectIcon />}
            onClick={onIncorrect}
            disabled={cardStatus !== 'not-answered' && cardStatus !== 'skipped'}
          >
            Incorrect
          </Button>
        </Stack>

        <IconButton 
          disabled={isLast} 
          onClick={onNext}
          size="large"
          color="primary"
        >
          <NextIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FlashcardView; 