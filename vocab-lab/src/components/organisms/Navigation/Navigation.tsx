import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export const Navigation: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Vocabulary Lab
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/explore"
            startIcon={<ExploreIcon />}
          >
            Explore
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/saved-sentences"
            startIcon={<BookmarkIcon />}
          >
            Saved Sentences
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/settings"
            startIcon={<SettingsIcon />}
          >
            Settings
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 