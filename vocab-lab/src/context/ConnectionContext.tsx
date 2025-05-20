import React, { createContext, useState, useEffect, useContext } from 'react';

interface ConnectionContextType {
  isConnected: boolean;
  storageMode: 'server' | 'localStorage';
}

const ConnectionContext = createContext<ConnectionContextType>({
  isConnected: false,
  storageMode: 'localStorage'
});

export const ConnectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [storageMode, setStorageMode] = useState<'server' | 'localStorage'>('localStorage');

  useEffect(() => {
    // Kiểm tra kết nối server khi component mount
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sentences');
        setIsConnected(response.ok);
        setStorageMode(response.ok ? 'server' : 'localStorage');
      } catch (error) {
        setIsConnected(false);
        setStorageMode('localStorage');
      }
    };

    checkConnection();
    // Kiểm tra lại định kỳ
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ConnectionContext.Provider value={{ isConnected, storageMode }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext); 