import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Tabs, 
  Tab, 
  Button, 
  Typography,
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { VocabularyColumn } from '../../organisms/VocabularyColumn/VocabularyColumn';
import { SelectedWords } from '../../organisms/SelectedWords/SelectedWords';
import { Vocabulary } from '../../../types/vocabulary';

interface HomePageProps {
  selectedWords: Vocabulary[];
  vocabularyByType: Record<string, Vocabulary[]>;
  availableTypes: string[];
  currentTypeFilter: string | null;
  handleWordSelect: (word: Vocabulary) => void;
  handleRemoveWord: (term: string) => void;
  setCurrentTypeFilter: (type: string | null) => void;
  refreshVocabulary: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedWords,
  vocabularyByType,
  availableTypes,
  currentTypeFilter,
  handleWordSelect,
  handleRemoveWord,
  setCurrentTypeFilter,
  refreshVocabulary,
}) => {
  const [showAllTypes, setShowAllTypes] = useState(true);

  const handleTypeFilterChange = (type: string | null) => {
    setCurrentTypeFilter(type);
    // When selecting a specific type, automatically show that type only
    if (type) {
      setShowAllTypes(false);
    }
  };

  const handleToggleAllTypes = () => {
    setShowAllTypes(prev => !prev);
    if (!showAllTypes) {
      // If switching to show all types, clear the type filter
      setCurrentTypeFilter(null);
    }
  };

  const handleRefresh = () => {
    refreshVocabulary();
  };

  // Determine which vocabulary data to display based on filters
  const getDisplayedVocabulary = () => {
    if (showAllTypes) {
      return vocabularyByType;
    }
    
    if (currentTypeFilter && vocabularyByType[currentTypeFilter]) {
      return { [currentTypeFilter]: vocabularyByType[currentTypeFilter] };
    }
    
    return vocabularyByType;
  };

  // Get the filtered vocabulary data
  const displayedVocabulary = getDisplayedVocabulary();

  return (
    <Box sx={{ py: 3 }}>
      <SelectedWords
        words={selectedWords}
        onRemoveWord={handleRemoveWord}
      />
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 4, 
        mb: 2 
      }}>
        <Typography variant="h6">
          Vocabulary by Type
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            size="small"
            startIcon={<FilterListIcon />}
            onClick={handleToggleAllTypes}
            variant={showAllTypes ? "contained" : "outlined"}
            color="primary"
          >
            {showAllTypes ? "Showing All Types" : "Showing Selected Type"}
          </Button>
          
          <Button 
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {!showAllTypes && (
        <Box sx={{ mb: 3, mt: 2 }}>
          <Tabs
            value={currentTypeFilter || "all"}
            onChange={(_, value) => handleTypeFilterChange(value === "all" ? null : value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Types" value="all" />
            {availableTypes.map(type => (
              <Tab 
                key={type} 
                label={type.charAt(0).toUpperCase() + type.slice(1)} 
                value={type} 
              />
            ))}
          </Tabs>
        </Box>
      )}
      
      <Grid 
        container 
        spacing={2} 
        sx={{ 
          mt: 1,
          mx: 'auto',
          width: '100%',
          maxWidth: '1400px'
        }}
      >
        {Object.entries(displayedVocabulary).map(([type, words]) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={showAllTypes ? 4 : 6}
            lg={showAllTypes ? 4 : 6}
            key={type}
            sx={{
              display: 'flex',
              alignItems: 'stretch'
            }}
          >
            <VocabularyColumn
              title={type.charAt(0).toUpperCase() + type.slice(1)}
              words={words}
              onWordSelect={handleWordSelect}
              selectedWords={selectedWords}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 