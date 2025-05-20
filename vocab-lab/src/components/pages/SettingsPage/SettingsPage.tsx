import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { ColorPicker } from '../../molecules/ColorPicker/ColorPicker';
import { useTheme } from '../../../context/ThemeContext';

export const SettingsPage: React.FC = () => {
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
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ColorPicker
            label="Background Color"
            value={themeSettings.selectedWordBgColor}
            onChange={(value) => handleColorChange('selectedWordBgColor', value)}
          />
          
          <ColorPicker
            label="Text Color"
            value={themeSettings.selectedWordTextColor}
            onChange={(value) => handleColorChange('selectedWordTextColor', value)}
          />
        </Box>

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