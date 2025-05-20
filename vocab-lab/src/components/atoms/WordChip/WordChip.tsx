import React, { memo } from 'react';
import { Chip, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../../../context/ThemeContext';
import { Vocabulary } from '../../../types/vocabulary';

interface WordChipProps {
  word: Vocabulary;
  onDelete?: () => void;
}

// Tối ưu hóa bằng React.memo để tránh render lại không cần thiết
export const WordChip: React.FC<WordChipProps> = memo(({ word, onDelete }) => {
  const { themeSettings } = useTheme();

  // Tạo biến để lưu trữ các giá trị tính toán trước
  const label = word.term;
  const tooltipTitle = `${word.type}: ${word.definition}`;

  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <Chip
        label={label}
        onDelete={onDelete}
        deleteIcon={onDelete && <DeleteIcon />}
        sx={{
          fontSize: '1rem',
          py: 2.5,
          bgcolor: themeSettings.selectedWordBgColor,
          color: themeSettings.selectedWordTextColor,
          '&:hover': {
            bgcolor: themeSettings.selectedWordBgColor,
            filter: 'brightness(90%)',
          },
          '& .MuiChip-label': {
            px: 2,
          },
          '& .MuiChip-deleteIcon': {
            color: themeSettings.selectedWordTextColor,
          }
        }}
      />
    </Tooltip>
  );
}, (prevProps, nextProps) => {
  // Kiểm soát chính xác khi nào component cần render lại
  // Chỉ render lại khi id của từ thay đổi hoặc hàm onDelete thay đổi
  return prevProps.word.id === nextProps.word.id && 
         prevProps.onDelete === nextProps.onDelete;
});

// Đặt displayName cho component để dễ debug
WordChip.displayName = 'WordChip'; 