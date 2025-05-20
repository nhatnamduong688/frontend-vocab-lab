import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  SelectChangeEvent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Khởi tạo selectedTypes với tất cả các loại được chọn
  useEffect(() => {
    if (availableTypes.length > 0 && selectedTypes.length === 0) {
      // Mặc định chọn tất cả các loại
      setSelectedTypes(availableTypes.map(type => type.name));
    }
  }, [availableTypes, selectedTypes.length]);

  // Xử lý khi checkbox thay đổi
  const handleTypeToggle = (typeName: string) => {
    setSelectedTypes(prevSelectedTypes => {
      let newSelectedTypes: string[];
      
      if (prevSelectedTypes.includes(typeName)) {
        // Nếu đã chọn, bỏ chọn
        newSelectedTypes = prevSelectedTypes.filter(t => t !== typeName);
      } else {
        // Nếu chưa chọn, thêm vào
        newSelectedTypes = [...prevSelectedTypes, typeName];
      }
      
      // Cập nhật filters
      updateFilters({ 
        types: newSelectedTypes.length > 0 ? newSelectedTypes as VocabularyType[] : undefined 
      });
      
      return newSelectedTypes;
    });
  };

  // Select/Deselect All
  const handleSelectAllTypes = (selectAll: boolean) => {
    if (selectAll) {
      const allTypes = availableTypes.map(type => type.name);
      setSelectedTypes(allTypes);
      updateFilters({ types: allTypes as VocabularyType[] });
    } else {
      setSelectedTypes([]);
      updateFilters({ types: [] });
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

      {/* Type Selection with Checkboxes */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Filter by Type</Typography>
        
        <Box mb={1}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedTypes.length === availableTypes.length} 
                indeterminate={selectedTypes.length > 0 && selectedTypes.length < availableTypes.length}
                onChange={(e) => handleSelectAllTypes(e.target.checked)}
              />
            }
            label={<Typography fontWeight="bold">Select All</Typography>}
          />
        </Box>
        
        <FormGroup row>
          {availableTypes.map((typeInfo) => (
            <FormControlLabel
              key={typeInfo.name}
              control={
                <Checkbox 
                  checked={selectedTypes.includes(typeInfo.name)} 
                  onChange={() => handleTypeToggle(typeInfo.name)}
                />
              }
              label={`${typeInfo.name} (${typeInfo.count})`}
              sx={{ width: { xs: '100%', sm: '50%', md: '33%', lg: '25%' } }}
            />
          ))}
        </FormGroup>
      </Paper>

      {/* Results Info */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">
          Showing {vocabulary.length} results
        </Typography>
        <Box>
          {selectedTypes.length > 0 && selectedTypes.length < availableTypes.length && (
            <Typography variant="body2" color="text.secondary">
              Filtered by {selectedTypes.length} types
            </Typography>
          )}
        </Box>
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