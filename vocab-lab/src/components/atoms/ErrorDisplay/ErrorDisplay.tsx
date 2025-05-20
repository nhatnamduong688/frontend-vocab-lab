import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry 
}) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderLeft: '4px solid #f44336'
        }}
      >
        <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        
        <Typography variant="h5" gutterBottom color="error">
          Oops! Something went wrong.
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        
        {onRetry && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  );
}; 