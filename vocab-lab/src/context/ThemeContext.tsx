import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeSettings {
  selectedWordBgColor: string;
  selectedWordTextColor: string;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
}

const defaultThemeSettings: ThemeSettings = {
  selectedWordBgColor: '#42a5f5', // primary.light default
  selectedWordTextColor: '#ffffff',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultThemeSettings;
  });

  useEffect(() => {
    localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
  }, [themeSettings]);

  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <ThemeContext.Provider value={{ themeSettings, updateThemeSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 