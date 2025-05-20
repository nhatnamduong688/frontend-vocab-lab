import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Tabs, 
  Tab, 
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useVocabulary } from '../hooks/useVocabulary';
import { VocabularyType, DifficultyLevel } from '../types/vocabulary';
import VocabularyCard from './VocabularyCard';

const VocabularyByType: React.FC = () => {
  const { 
    loading, 
    error, 
    vocabulary, 
    availableTypes, 
    filters,
    updateFilters 
  } = useVocabulary();

  const [searchText, setSearchText] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('');

  // Xử lý thay đổi tab loại từ
  const handleTypeChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    
    if (newValue === '') {
      // Nếu chọn "All", xóa bộ lọc loại
      updateFilters({ types: undefined });
    } else {
      // Nếu chọn một loại, đặt bộ lọc cho loại đó
      updateFilters({ types: [newValue as VocabularyType] });
    }
  };

  // Xử lý thay đổi độ khó
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    updateFilters({ difficulty: value === '' ? undefined : value as DifficultyLevel });
  };

  // Xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    updateFilters({ searchText: event.target.value });
  };

  if (loading && !vocabulary.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4} textAlign="center">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Vocabulary Explorer
      </Typography>

      {/* Filter Controls */}
      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search for terms or definitions..."
              value={searchText}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-select-label"
                value={filters.difficulty || ''}
                onChange={handleDifficultyChange}
                displayEmpty
              >
                <MenuItem value="">All Difficulties</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Type Tabs */}
      <Box mb={4}>
        <Tabs
          value={selectedTab}
          onChange={handleTypeChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Types" value="" />
          {availableTypes.map((typeInfo) => (
            <Tab 
              key={typeInfo.name} 
              label={`${typeInfo.name} (${typeInfo.count})`} 
              value={typeInfo.name} 
            />
          ))}
        </Tabs>
      </Box>

      {/* Results Info */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">
          Showing {vocabulary.length} results
        </Typography>
        {filters.types && filters.types.length > 0 && (
          <Box>
            {filters.types.map(type => (
              <Chip 
                key={type} 
                label={type} 
                onDelete={() => {
                  setSelectedTab('');
                  updateFilters({ types: undefined });
                }}
                color="primary"
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Vocabulary Cards */}
      <Grid container spacing={3}>
        {vocabulary.length > 0 ? (
          vocabulary.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <VocabularyCard vocabulary={item} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" variant="h6">
              No vocabulary items found matching your criteria.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default VocabularyByType;