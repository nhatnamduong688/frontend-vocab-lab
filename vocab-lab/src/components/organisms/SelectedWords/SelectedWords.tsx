import React, { useState, useCallback, memo } from 'react';
import { Box, Paper, Typography, Stack, Button, Snackbar, Alert, ButtonGroup, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { Vocabulary } from '../../../types/vocabulary';
import { WordChip } from '../../atoms/WordChip/WordChip';
import { saveSentence, exportSentencesToFile, displaySentencesAsMarkdown } from '../../../services/sentenceService';

interface SelectedWordsProps {
  words: Vocabulary[];
  onRemoveWord: (term: string) => void;
  onClearWords?: () => void;
}

// Tạo một memo component để tránh render lại WordChip không cần thiết
const MemoizedWordChip = memo(WordChip);

export const SelectedWords: React.FC<SelectedWordsProps> = ({
  words,
  onRemoveWord,
  onClearWords,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  const [isProcessing, setIsProcessing] = useState(false);

  // Xử lý khi click nút lưu - sử dụng useCallback để tránh tạo hàm mới mỗi khi render
  const handleSaveSentence = useCallback(async () => {
    if (words.length < 2) {
      setSnackbarMessage('Vui lòng chọn ít nhất 2 từ để tạo câu.');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
      return;
    }

    // Thêm chỉ báo đang xử lý
    setIsProcessing(true);

    try {
      await saveSentence(words);
      setSnackbarMessage('Câu đã được lưu thành công!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error saving sentence:', error);
      setSnackbarMessage('Có lỗi xảy ra khi lưu câu.');
      setSnackbarSeverity('error');
    } finally {
      setIsProcessing(false);
      setSnackbarOpen(true);
    }
  }, [words]);

  // Xử lý khi click nút export
  const handleExportSentences = useCallback(async () => {
    // Thêm chỉ báo đang xử lý
    setIsProcessing(true);

    try {
      await exportSentencesToFile();
      setSnackbarMessage('File đã được tải xuống.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error exporting file:', error);
      setSnackbarMessage('Có lỗi xảy ra khi xuất file.');
      setSnackbarSeverity('error');
    } finally {
      setIsProcessing(false);
      setSnackbarOpen(true);
    }
  }, []);

  // Xử lý khi click nút hiển thị markdown
  const handleShowMarkdown = useCallback(async () => {
    setIsProcessing(true);

    try {
      await displaySentencesAsMarkdown();
      setSnackbarMessage('Markdown đã được hiển thị trong cửa sổ mới.');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Error displaying markdown:', error);
      setSnackbarMessage('Có lỗi xảy ra khi tạo markdown.');
      setSnackbarSeverity('error');
    } finally {
      setIsProcessing(false);
      setSnackbarOpen(true);
    }
  }, []);

  // Xử lý khi đóng snackbar
  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // Xử lý khi click nút clear
  const handleClearWords = useCallback(() => {
    if (onClearWords) {
      onClearWords();
    }
  }, [onClearWords]);

  // Tạo chuỗi câu từ các từ đã chọn - tính toán trước để tránh tính toán lại khi render
  const sentenceText = words.length > 0 ? words.map(word => word.term).join(' ') : '';

  return (
    <Paper 
      elevation={2}
      sx={{
        width: '100%',
        maxWidth: '1400px',
        mx: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 500,
            textAlign: 'center',
            flexGrow: 1
          }}
        >
          Sentence Formation
        </Typography>
        
        <Button
          component={Link}
          to="/saved-sentences"
          color="inherit"
          size="small"
          startIcon={<BookmarkIcon />}
          sx={{
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          View Saved Sentences
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={3}>
          {/* Instructions */}
          <Typography 
            variant="body2" 
            color="text.secondary"
            align="center"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Select words from the columns below to form your sentence. Click on any word to remove it.
          </Typography>

          {/* Selected Words Area */}
          <Paper 
            variant="outlined"
            sx={{ 
              p: { xs: 2, sm: 3 },
              minHeight: '100px',
              bgcolor: 'background.default',
              borderRadius: 1,
              position: 'relative'
            }}
          >
            {/* Processing Indicator */}
            {isProcessing && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 1,
                  borderRadius: 1
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )}
            
            {/* Words Container */}
            <Box 
              sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
                justifyContent: words.length ? 'flex-start' : 'center',
                minHeight: '50px'
              }}
            >
              {words.length === 0 ? (
                <Typography color="text.secondary" variant="body1">
                  Your selected words will appear here
                </Typography>
              ) : (
                words.map((word) => (
                  <MemoizedWordChip
                    key={word.id}
                    word={word}
                    onDelete={() => onRemoveWord(word.term)}
                  />
                ))
              )}
            </Box>

            {/* Sentence Preview */}
            {words.length > 0 && (
              <Box sx={{ 
                mt: 3,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography 
                  variant="body1" 
                  color="text.primary" 
                  sx={{ 
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    textAlign: 'center'
                  }}
                >
                  {sentenceText}
                </Typography>
              </Box>
            )}
            
            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 3,
              gap: 2
            }}>
              <ButtonGroup variant="contained" aria-label="sentence actions">
                <Button 
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSentence}
                  disabled={words.length < 2 || isProcessing}
                  color="primary"
                >
                  Save Sentence
                </Button>
                
                <Tooltip title="Show as Markdown">
                  <span>
                    <IconButton 
                      onClick={handleShowMarkdown} 
                      color="primary"
                      disabled={isProcessing}
                      sx={{ borderRadius: 0 }}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                
                <Tooltip title="Export as JSON">
                  <span>
                    <IconButton 
                      onClick={handleExportSentences} 
                      color="primary"
                      disabled={isProcessing}
                      sx={{ borderRadius: 0 }}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ButtonGroup>
              
              <Tooltip title="Clear all words">
                <span> {/* Wrap in span to allow tooltip on disabled button */}
                  <IconButton
                    onClick={handleClearWords}
                    disabled={words.length === 0 || isProcessing}
                    color="error"
                  >
                    <DeleteSweepIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Paper>
        </Stack>
      </Box>
      
      {/* Notification */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}; 