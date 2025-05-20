import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, Grid } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { Settings } from './components/Settings';
import VocabularyColumn from './components/VocabularyColumn';
import SelectedWords from './components/SelectedWords';
import { useVocabulary } from './hooks/useVocabulary';

function App() {
  const {
    selectedWords,
    loading,
    error,
    vocabularyByType,
    handleWordSelect,
    handleRemoveWord,
  } = useVocabulary();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const HomePage = () => (
    <Box sx={{ py: 3 }}>
      <SelectedWords
        selectedWords={selectedWords}
        onRemoveWord={handleRemoveWord}
      />
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          mt: 3,
          mx: 'auto',
          width: '100%',
          maxWidth: '1400px'
        }}
      >
        {Object.entries(vocabularyByType).map(([type, words]) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={type}
            sx={{
              display: 'flex',
              alignItems: 'stretch'
            }}
          >
            <VocabularyColumn
              title={type}
              words={words}
              onWordSelect={handleWordSelect}
              selectedWords={selectedWords}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <ThemeProvider>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Vocabulary Lab
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/settings">
                Settings
              </Button>
            </Toolbar>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
