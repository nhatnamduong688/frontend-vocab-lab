import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';

export const Settings: React.FC = () => {
  const { themeSettings, updateThemeSettings } = useTheme();

  const handleColorChange = (setting: 'selectedWordBgColor' | 'selectedWordTextColor', value: string) => {
    updateThemeSettings({ [setting]: value });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selected Word Appearance
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Background Color</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <input
                type="color"
                value={themeSettings.selectedWordBgColor}
                onChange={(e) => handleColorChange('selectedWordBgColor', e.target.value)}
                style={{ width: '50px', height: '50px' }}
              />
              <TextField
                size="small"
                value={themeSettings.selectedWordBgColor}
                onChange={(e) => handleColorChange('selectedWordBgColor', e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Text Color</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <input
                type="color"
                value={themeSettings.selectedWordTextColor}
                onChange={(e) => handleColorChange('selectedWordTextColor', e.target.value)}
                style={{ width: '50px', height: '50px' }}
              />
              <TextField
                size="small"
                value={themeSettings.selectedWordTextColor}
                onChange={(e) => handleColorChange('selectedWordTextColor', e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Preview
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              px: 3,
              py: 2,
              borderRadius: 4,
              bgcolor: themeSettings.selectedWordBgColor,
              color: themeSettings.selectedWordTextColor,
            }}
          >
            Sample Selected Word
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              updateThemeSettings({
                selectedWordBgColor: '#42a5f5',
                selectedWordTextColor: '#ffffff',
              });
            }}
          >
            Reset to Default
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}; 