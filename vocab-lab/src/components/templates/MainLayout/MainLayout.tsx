import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Navigation } from '../../organisms/Navigation/Navigation';
import { ConnectionStatus } from '../../atoms/ConnectionStatus/ConnectionStatus';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navigation />
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
          <ConnectionStatus />
        </Box>
        {children}
      </Container>
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          py: 1,
          px: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Vocabulary Lab © {new Date().getFullYear()}
        </Typography>
        <ConnectionStatus />
      </Paper>
    </Box>
  );
}; 