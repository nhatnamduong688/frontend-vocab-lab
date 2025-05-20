import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Checkbox,
  Slider,
  Button,
  Divider,
  Chip,
  Stack,
  Grid,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
  FlashcardSettings as FlashcardSettingsType, 
  FlashcardMode, 
  DifficultyLevel,
  VocabularyTypeInfo
} from '../types/vocabulary';

const DEFAULT_SETTINGS: FlashcardSettingsType = {
  mode: 'term-to-definition',
  showExamples: true,
  showCodeExamples: true,
  filterByTypes: undefined,
  filterByDifficulty: undefined,
  limitCount: 10,
};

interface FlashcardSettingsProps {
  availableTypes: VocabularyTypeInfo[];
  onStartSession: (settings: FlashcardSettingsType) => Promise<void>;
  loading: boolean;
}

const FlashcardSettings: React.FC<FlashcardSettingsProps> = ({
  availableTypes,
  onStartSession,
  loading
}) => {
  const [settings, setSettings] = useState<FlashcardSettingsType>(DEFAULT_SETTINGS);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error when settings change
  useEffect(() => {
    setError(null);
  }, [settings]);

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      mode: (event.target.value as FlashcardMode)
    });
  };

  const handleToggleChange = (field: 'showExamples' | 'showCodeExamples') => 
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({
        ...settings,
        [field]: event.target.checked
      });
    };

  const handleLimitChange = (_event: Event, newValue: number | number[]) => {
    setSettings({
      ...settings,
      limitCount: newValue as number
    });
  };

  const handleDifficultyToggle = (difficulty: DifficultyLevel) => {
    setSettings(prev => {
      const currentDifficulties = prev.filterByDifficulty || [];
      let newDifficulties: DifficultyLevel[];
      
      if (currentDifficulties.includes(difficulty)) {
        // Remove if already selected
        newDifficulties = currentDifficulties.filter(d => d !== difficulty);
      } else {
        // Add if not selected
        newDifficulties = [...currentDifficulties, difficulty];
      }
      
      return {
        ...prev,
        filterByDifficulty: newDifficulties.length > 0 ? newDifficulties : undefined
      };
    });
  };

  const handleTypeToggle = (typeName: string) => {
    setSettings(prev => {
      const currentTypes = prev.filterByTypes || [];
      let newTypes: string[];
      
      if (currentTypes.includes(typeName)) {
        // Remove if already selected
        newTypes = currentTypes.filter(t => t !== typeName);
      } else {
        // Add if not selected
        newTypes = [...currentTypes, typeName];
      }
      
      return {
        ...prev,
        filterByTypes: newTypes.length > 0 ? newTypes : undefined
      };
    });
  };

  const handleSelectAllTypes = () => {
    setSettings(prev => ({
      ...prev,
      filterByTypes: availableTypes.map(t => t.name)
    }));
  };

  const handleClearAllTypes = () => {
    setSettings(prev => ({
      ...prev,
      filterByTypes: undefined
    }));
  };

  const handleStartSession = async () => {
    try {
      await onStartSession(settings);
    } catch (e) {
      setError('Failed to start flashcard session');
    }
  };

  const isDifficultySelected = (difficulty: DifficultyLevel) => {
    return settings.filterByDifficulty?.includes(difficulty) || false;
  };

  const isTypeSelected = (typeName: string) => {
    return settings.filterByTypes?.includes(typeName) || false;
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Flashcard Settings
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box mb={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Study Mode</FormLabel>
            <RadioGroup 
              row 
              value={settings.mode} 
              onChange={handleModeChange}
            >
              <FormControlLabel 
                value="term-to-definition" 
                control={<Radio />} 
                label="Term → Definition" 
              />
              <FormControlLabel 
                value="definition-to-term" 
                control={<Radio />} 
                label="Definition → Term" 
              />
              <FormControlLabel 
                value="mixed" 
                control={<Radio />} 
                label="Mixed" 
              />
            </RadioGroup>
          </FormControl>
        </Box>
        
        <Box mb={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Display Options</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={settings.showExamples} 
                    onChange={handleToggleChange('showExamples')}
                  />
                }
                label="Show Examples"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={settings.showCodeExamples} 
                    onChange={handleToggleChange('showCodeExamples')}
                  />
                }
                label="Show Code Examples"
              />
            </FormGroup>
          </FormControl>
        </Box>
        
        <Box mb={4}>
          <FormControl fullWidth>
            <FormLabel>Number of Cards</FormLabel>
            <Box px={2}>
              <Slider
                value={settings.limitCount || 10}
                onChange={handleLimitChange}
                aria-labelledby="limit-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={5}
                max={50}
              />
            </Box>
            <Typography variant="caption" align="center">
              {settings.limitCount} cards
            </Typography>
          </FormControl>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Chip 
            icon={<SettingsIcon />} 
            label="Advanced Filters" 
            onClick={() => setAdvancedMode(!advancedMode)}
            color={advancedMode ? "primary" : "default"}
            variant={advancedMode ? "filled" : "outlined"}
          />
        </Divider>
        
        {advancedMode && (
          <>
            <Box mb={4}>
              <FormLabel component="legend">Filter by Difficulty</FormLabel>
              <Stack direction="row" spacing={1} mt={1}>
                <Chip 
                  label="Easy"
                  onClick={() => handleDifficultyToggle('easy')}
                  color={isDifficultySelected('easy') ? "success" : "default"}
                  variant={isDifficultySelected('easy') ? "filled" : "outlined"}
                />
                <Chip 
                  label="Medium"
                  onClick={() => handleDifficultyToggle('medium')}
                  color={isDifficultySelected('medium') ? "warning" : "default"}
                  variant={isDifficultySelected('medium') ? "filled" : "outlined"}
                />
                <Chip 
                  label="Hard"
                  onClick={() => handleDifficultyToggle('hard')}
                  color={isDifficultySelected('hard') ? "error" : "default"}
                  variant={isDifficultySelected('hard') ? "filled" : "outlined"}
                />
              </Stack>
            </Box>
            
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <FormLabel component="legend">Filter by Type</FormLabel>
                <Box>
                  <Button 
                    size="small" 
                    onClick={handleSelectAllTypes}
                    sx={{ mr: 1 }}
                  >
                    Select All
                  </Button>
                  <Button 
                    size="small" 
                    onClick={handleClearAllTypes}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
              
              <Grid container spacing={1}>
                {availableTypes.map(type => (
                  <Grid item key={type.name} xs={6} sm={4} md={3}>
                    <Chip 
                      label={`${type.name} (${type.count})`}
                      onClick={() => handleTypeToggle(type.name)}
                      color={isTypeSelected(type.name) ? "primary" : "default"}
                      variant={isTypeSelected(type.name) ? "filled" : "outlined"}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
        
        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={handleStartSession}
            disabled={loading}
          >
            Start Flashcards
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FlashcardSettings; 