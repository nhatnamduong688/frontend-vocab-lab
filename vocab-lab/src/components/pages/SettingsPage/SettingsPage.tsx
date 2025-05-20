import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid,
  Divider,
  Button,
  ButtonGroup,
  Snackbar,
  Alert
} from '@mui/material';
import { useTheme, ColorTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { themeSettings, setColorTheme, resetThemeSettings } = useTheme();
  const [showSuccess, setShowSuccess] = React.useState(false);
  const navigate = useNavigate();

  const handleThemeChange = (theme: ColorTheme) => {
    setColorTheme(theme);
    setShowSuccess(true);
  };

  const handleReset = () => {
    resetThemeSettings();
    setShowSuccess(true);
  };

  const handleSave = () => {
    navigate('/');
  };

  const ColorPreview = ({ theme, label }: { theme: ColorTheme, label: string }) => {
    const colorPreviews = {
      soft: ["#90caf9", "#ce93d8", "#a5d6a7", "#ffcc80", "#ef9a9a"],
      vivid: ["#2196f3", "#9c27b0", "#4caf50", "#ff9800", "#f44336"],
      pastel: ["#bbdefb", "#e1bee7", "#c8e6c9", "#ffe0b2", "#ffcdd2"]
    };

    return (
      <Box 
        onClick={() => handleThemeChange(theme)}
        sx={{ 
          cursor: 'pointer',
          mb: 2,
          p: 2,
          border: themeSettings.colorTheme === theme ? '2px solid #1976d2' : '2px solid transparent',
          borderRadius: 2,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>{label}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          {colorPreviews[theme].map((color, index) => (
            <Box 
              key={index}
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: color,
                borderRadius: '50%',
                border: '1px solid #e0e0e0'
              }} 
            />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Cài đặt ứng dụng
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Giao diện màu sắc
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <ColorPreview theme="soft" label="Nhẹ nhàng" />
            </Grid>
            <Grid item xs={12} md={4}>
              <ColorPreview theme="pastel" label="Pastel" />
            </Grid>
            <Grid item xs={12} md={4}>
              <ColorPreview theme="vivid" label="Rực rỡ" />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={handleReset}
          >
            Khôi phục mặc định
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSave}
          >
            Lưu cài đặt
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Cài đặt đã được cập nhật!
        </Alert>
      </Snackbar>
    </Container>
  );
}; 