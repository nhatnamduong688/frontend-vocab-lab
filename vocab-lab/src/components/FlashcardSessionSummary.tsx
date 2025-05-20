import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Divider, 
  CircularProgress, 
  Stack,
  Grid
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';
import { FlashcardSession } from '../types/vocabulary';

interface FlashcardSessionSummaryProps {
  session: FlashcardSession;
  onReset: () => Promise<void>;
  onNewSession: () => void;
}

const FlashcardSessionSummary: React.FC<FlashcardSessionSummaryProps> = ({
  session,
  onReset,
  onNewSession
}) => {
  // Calculate stats
  const totalCards = session.cards.length;
  const completedCards = session.completedCardIds.length;
  const correctAnswers = session.correctCount;
  const incorrectAnswers = session.incorrectCount;
  const skippedCards = completedCards - correctAnswers - incorrectAnswers;
  const completionPercentage = Math.round((completedCards / totalCards) * 100);
  const correctPercentage = completedCards > 0 
    ? Math.round((correctAnswers / completedCards) * 100) 
    : 0;
  
  // Format session date
  const sessionDate = new Date(session.date).toLocaleString();
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Session Summary
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {sessionDate}
        </Typography>
      </Box>
      
      <Grid container spacing={4} mb={4}>
        {/* Progress Circle */}
        <Grid item xs={12} sm={6} md={6} textAlign="center">
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={completionPercentage}
              size={180}
              thickness={5}
              sx={{ color: correctPercentage >= 70 ? 'success.main' : 'warning.main' }}
            />
            <Box
              position="absolute"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              top={0}
              left={0}
              bottom={0}
              right={0}
            >
              <Typography variant="h4" component="div" color="text.primary">
                {completionPercentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completed
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        {/* Stats */}
        <Grid item xs={12} sm={6} md={6}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          
          <Stack spacing={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography>Correct answers</Typography>
              </Box>
              <Typography variant="h6">
                {correctAnswers} ({completedCards > 0 ? Math.round((correctAnswers / completedCards) * 100) : 0}%)
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography>Incorrect answers</Typography>
              </Box>
              <Typography variant="h6">
                {incorrectAnswers} ({completedCards > 0 ? Math.round((incorrectAnswers / completedCards) * 100) : 0}%)
              </Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography>Total cards</Typography>
              <Typography variant="h6">{totalCards}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Session details */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Session Settings
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Mode</Typography>
            <Typography variant="body1">
              {session.settings.mode === 'term-to-definition' 
                ? 'Term to Definition' 
                : session.settings.mode === 'definition-to-term'
                ? 'Definition to Term'
                : 'Mixed'}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">Difficulty</Typography>
            <Typography variant="body1">
              {session.settings.filterByDifficulty 
                ? session.settings.filterByDifficulty.join(', ') 
                : 'All levels'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">Types</Typography>
            <Typography variant="body1">
              {session.settings.filterByTypes 
                ? session.settings.filterByTypes.join(', ') 
                : 'All types'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {/* Action buttons */}
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<ReplayIcon />}
          onClick={onReset}
        >
          Try Again
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SettingsIcon />}
          onClick={onNewSession}
        >
          New Session
        </Button>
      </Box>
    </Paper>
  );
};

export default FlashcardSessionSummary; 