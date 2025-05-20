import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Button, 
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Khởi tạo selectedTypes với tất cả các loại được chọn
  useEffect(() => {
    if (availableTypes.length > 0 && selectedTypes.length === 0) {
      setSelectedTypes([...availableTypes]);
    }
  }, [availableTypes, selectedTypes.length]);

  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes(prevSelectedTypes => {
      if (prevSelectedTypes.includes(typeName)) {
        // Nếu đã chọn, bỏ chọn
        return prevSelectedTypes.filter(t => t !== typeName);
      } else {
        // Nếu chưa chọn, thêm vào
        return [...prevSelectedTypes, typeName];
      }
    });
  };

  const handleSelectAllTypes = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedTypes([...availableTypes]);
    } else {
      setSelectedTypes([]);
    }
  };

  const handleRefresh = () => {
    refreshVocabulary();
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(prev => !prev);
  };

  // Get the filtered vocabulary data
  const displayedVocabulary = Object.entries(vocabularyByType)
    .filter(([type]) => selectedTypes.includes(type))
    .reduce((acc, [type, words]) => {
      acc[type] = words;
      return acc;
    }, {} as Record<string, Vocabulary[]>);

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
            startIcon={showFilterPanel ? <ExpandLessIcon /> : <FilterListIcon />}
            onClick={toggleFilterPanel}
            variant={showFilterPanel ? "contained" : "outlined"}
            color="primary"
          >
            Filter Types
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
      
      <Collapse in={showFilterPanel}>
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Select Types to Display</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedTypes.length === availableTypes.length} 
                    indeterminate={selectedTypes.length > 0 && selectedTypes.length < availableTypes.length}
                    onChange={(e) => handleSelectAllTypes(e.target.checked)}
                    size="small"
                  />
                }
                label="Select All"
              />
            </Box>
          </Box>
          
          <FormGroup row>
            {availableTypes.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox 
                    checked={selectedTypes.includes(type)} 
                    onChange={() => handleTypeToggle(type)}
                    size="small"
                  />
                }
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                sx={{ width: { xs: '50%', sm: '33%', md: '25%' } }}
              />
            ))}
          </FormGroup>
        </Paper>
      </Collapse>
      
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
            md={4}
            lg={4}
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
        
        {Object.keys(displayedVocabulary).length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No vocabulary types selected. Please select at least one type to display.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}; 