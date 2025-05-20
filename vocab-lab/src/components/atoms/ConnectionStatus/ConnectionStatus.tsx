import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import StorageIcon from '@mui/icons-material/Storage';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { useConnection } from '../../../context/ConnectionContext';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, storageMode } = useConnection();

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Tooltip 
        title={isConnected 
          ? "Đã kết nối đến server" 
          : "Không kết nối đến server, dữ liệu chỉ được lưu cục bộ"
        }
      >
        <Chip
          icon={isConnected ? <CloudDoneIcon /> : <CloudOffIcon />}
          label={isConnected ? "Connected" : "Offline"}
          color={isConnected ? "success" : "error"}
          size="small"
          variant="outlined"
        />
      </Tooltip>
      
      <Tooltip 
        title={storageMode === 'server' 
          ? "Dữ liệu đang được lưu trên server" 
          : "Dữ liệu đang được lưu trong localStorage của trình duyệt"
        }
      >
        <Chip
          icon={storageMode === 'server' ? <StorageIcon /> : <PhoneIphoneIcon />}
          label={storageMode === 'server' ? "Server Storage" : "Browser Storage"}
          color={storageMode === 'server' ? "primary" : "warning"}
          size="small"
          variant="outlined"
        />
      </Tooltip>
    </Box>
  );
}; 