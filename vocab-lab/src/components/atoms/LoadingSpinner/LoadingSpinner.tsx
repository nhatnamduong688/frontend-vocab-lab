import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export const LoadingSpinner: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: 2
    }}>
      <CircularProgress />
      <Typography>Loading...</Typography>
    </Box>
  );
}; 