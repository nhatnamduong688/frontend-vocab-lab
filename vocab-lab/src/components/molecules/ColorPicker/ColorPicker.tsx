import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <Box>
      <Typography gutterBottom>{label}</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '50px', height: '50px' }}
        />
        <TextField
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Box>
  );
}; 