import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export type SortOption = 'alphabetical' | 'level' | 'recent';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <FormControl fullWidth size="small">
        <InputLabel>Sort by</InputLabel>
        <Select
          value={value}
          label="Sort by"
          onChange={(e) => onChange(e.target.value as SortOption)}
        >
          <MenuItem value="alphabetical">Alphabetical</MenuItem>
          <MenuItem value="level">Level</MenuItem>
          <MenuItem value="recent">Recently Added</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}; 