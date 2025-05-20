import React from 'react';
import { Box, Container } from '@mui/material';
import { Navigation } from '../../organisms/Navigation/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navigation />
      <Container>
        {children}
      </Container>
    </Box>
  );
}; 