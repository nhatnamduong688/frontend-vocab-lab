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
  Paper,
  Backdrop,
  Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useVocabulary } from '../hooks/useVocabulary';
import { VocabularyType, DifficultyLevel } from '../types/vocabulary';
import VocabularyCard from './VocabularyCard';

const VocabularyByType: React.FC = () => {
  const { 
    loading, 
    loadingInfo,
    error, 
    vocabulary, 
    availableTypes, 
    filters,
    updateFilters,
    refreshData 
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

  // Hiển thị full-screen loading khi chưa có dữ liệu
  if (loading && !vocabulary.length) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {loadingInfo.message}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4} textAlign="center">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" gutterBottom>
            Unable to load vocabulary data. Please try again.
          </Typography>
          <Box 
            component="button" 
            onClick={() => refreshData()} 
            sx={{ 
              mt: 2, 
              border: '1px solid', 
              borderColor: 'primary.main', 
              borderRadius: 1,
              px: 2,
              py: 1,
              bgcolor: 'transparent',
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'primary.50'
              }
            }}
          >
            Try Again
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={3} position="relative">
      {/* Backdrop loading overlay khi đang tải lại dữ liệu */}
      <Backdrop
        sx={{
          position: 'absolute',
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
        open={loading && vocabulary.length > 0}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ mt: 2, color: 'white' }}>
            {loadingInfo.message}
          </Typography>
        </Box>
      </Backdrop>

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
              disabled={loading && !vocabulary.length}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: loading && (
                  <InputAdornment position="end">
                    <Box display="flex" alignItems="center">
                      <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
                        {loadingInfo.message}
                      </Typography>
                      <CircularProgress size={20} />
                    </Box>
                  </InputAdornment>
                )
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
                disabled={loading && !vocabulary.length}
                endAdornment={loading && <CircularProgress size={20} sx={{ mr: 2 }} />}
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>Filter by Type</Typography>
          {loading && (
            <Box display="flex" alignItems="center">
              <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
                {loadingInfo.types ? 'Loading types...' : ''}
              </Typography>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
        
        <Box mb={1}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={selectedTypes.length === availableTypes.length} 
                indeterminate={selectedTypes.length > 0 && selectedTypes.length < availableTypes.length}
                onChange={(e) => handleSelectAllTypes(e.target.checked)}
                disabled={loading && !vocabulary.length}
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
                  disabled={loading && !vocabulary.length}
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
        <Box display="flex" alignItems="center">
          {loading && (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="caption" sx={{ mr: 2, color: 'text.secondary' }}>
                {loadingInfo.message}
              </Typography>
            </>
          )}
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