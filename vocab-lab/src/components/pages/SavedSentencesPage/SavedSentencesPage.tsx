import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton, 
  Tooltip,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
  ButtonGroup,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { 
  getSavedSentences, 
  deleteSentence, 
  clearAllSentences,
  exportSentencesToFile,
  exportSentencesToMarkdownFile
} from '../../../services/sentenceService';
import { Vocabulary } from '../../../types/vocabulary';

interface SavedSentence {
  id: string;
  text: string;
  words: Vocabulary[];
  timestamp: number;
}

export const SavedSentencesPage: React.FC = () => {
  const [sentences, setSentences] = useState<SavedSentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Tải dữ liệu câu đã lưu
  const loadSavedSentences = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedSentences = await getSavedSentences();
      setSentences(savedSentences);
    } catch (error) {
      console.error('Failed to load saved sentences:', error);
      showSnackbar('Không thể tải các câu đã lưu', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hiển thị thông báo
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Xóa một câu
  const handleDeleteSentence = useCallback(async (id: string) => {
    setIsProcessing(true);
    try {
      await deleteSentence(id);
      setSentences(prev => prev.filter(sentence => sentence.id !== id));
      showSnackbar('Câu đã được xóa thành công');
    } catch (error) {
      console.error('Failed to delete sentence:', error);
      showSnackbar('Không thể xóa câu', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Xóa tất cả câu
  const handleClearAllSentences = useCallback(async () => {
    setOpenDialog(false);
    setIsProcessing(true);
    try {
      await clearAllSentences();
      setSentences([]);
      showSnackbar('Tất cả các câu đã được xóa');
    } catch (error) {
      console.error('Failed to clear sentences:', error);
      showSnackbar('Không thể xóa tất cả các câu', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Xuất ra file JSON
  const handleExportToJson = useCallback(async () => {
    setIsProcessing(true);
    try {
      await exportSentencesToFile('my-saved-sentences');
      showSnackbar('File JSON đã được tải xuống');
    } catch (error) {
      console.error('Failed to export to JSON:', error);
      showSnackbar('Không thể xuất file JSON', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Xuất ra file Markdown
  const handleExportToMarkdown = useCallback(async () => {
    setIsProcessing(true);
    try {
      await exportSentencesToMarkdownFile('my-saved-sentences');
      showSnackbar('File Markdown đã được tải xuống');
    } catch (error) {
      console.error('Failed to export to Markdown:', error);
      showSnackbar('Không thể xuất file Markdown', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Tải dữ liệu khi component mount
  useEffect(() => {
    loadSavedSentences();
  }, [loadSavedSentences]);

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '50vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" fontWeight={500}>
            Saved Sentences
          </Typography>
          
          <ButtonGroup variant="outlined" disabled={isProcessing || sentences.length === 0}>
            <Tooltip title="Export as JSON">
              <Button 
                startIcon={<FileDownloadIcon />}
                onClick={handleExportToJson}
              >
                JSON
              </Button>
            </Tooltip>
            <Tooltip title="Export as Markdown">
              <Button 
                startIcon={<DescriptionIcon />}
                onClick={handleExportToMarkdown}
              >
                Markdown
              </Button>
            </Tooltip>
            <Tooltip title="Clear all sentences">
              <Button 
                startIcon={<ClearAllIcon />}
                onClick={() => setOpenDialog(true)}
                color="error"
              >
                Clear All
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Box>

        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {sentences.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="text.secondary">
              No saved sentences yet. Create sentences in the Homepage to see them here.
            </Typography>
          </Paper>
        ) : (
          <List sx={{ width: '100%' }}>
            {sentences.map((sentence, index) => (
              <React.Fragment key={sentence.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Tooltip title="Delete sentence">
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDeleteSentence(sentence.id)}
                        disabled={isProcessing}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                        {sentence.text}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                          Created: {new Date(sentence.timestamp).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {sentence.words.map((word) => (
                            <Chip
                              key={word.id}
                              label={word.term}
                              size="small"
                              variant="outlined"
                              color="primary"
                              title={`${word.type}: ${word.definition}`}
                            />
                          ))}
                        </Box>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < sentences.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Dialog xác nhận xóa tất cả */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Delete All</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all saved sentences? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleClearAllSentences} color="error" autoFocus>
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 