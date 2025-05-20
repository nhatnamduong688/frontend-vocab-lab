import React, { createContext, useContext, useState, useEffect } from 'react';

// Define color themes
export type ColorTheme = 'soft' | 'vivid' | 'pastel';

interface ThemeSettings {
  selectedWordBgColor: string;
  selectedWordTextColor: string;
  colorTheme: ColorTheme;
  typeColors: {
    [key: string]: string;
  };
  difficultyColors: {
    [key: string]: string;
  };
  frequencyColors: {
    [key: string]: string;
  };
  defaultColor: string;
}

interface ThemeContextType {
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  setColorTheme: (theme: ColorTheme) => void;
  resetThemeSettings: () => void;
}

// Color palettes
const colorPalettes = {
  soft: {
    typeColors: {
      noun: '#90caf9', // Soft blue
      verb: '#ce93d8', // Soft purple
      adjective: '#80deea', // Soft cyan
      adverb: '#a5d6a7', // Soft green
      preposition: '#ffcc80', // Soft orange
      conjunction: '#bcaaa4', // Soft brown
      pronoun: '#b0bec5', // Soft blue grey
      other: '#e0e0e0', // Soft grey
    },
    difficultyColors: {
      easy: '#a5d6a7', // Soft green
      medium: '#ffcc80', // Soft orange
      hard: '#ef9a9a', // Soft red
    },
    frequencyColors: {
      high: '#90caf9', // Soft blue
      medium: '#ffcc80', // Soft orange
      low: '#e0e0e0', // Soft grey
    },
    defaultColor: '#e0e0e0', // Soft grey
  },
  vivid: {
    typeColors: {
      noun: '#2196f3', // Blue
      verb: '#9c27b0', // Purple
      adjective: '#00bcd4', // Cyan
      adverb: '#4caf50', // Green
      preposition: '#ff9800', // Orange
      conjunction: '#795548', // Brown
      pronoun: '#607d8b', // Blue Grey
      other: '#9e9e9e', // Grey
    },
    difficultyColors: {
      easy: '#4caf50', // Green
      medium: '#ff9800', // Orange
      hard: '#f44336', // Red
    },
    frequencyColors: {
      high: '#2196f3', // Blue
      medium: '#ff9800', // Orange
      low: '#9e9e9e', // Grey
    },
    defaultColor: '#9e9e9e', // Grey
  },
  pastel: {
    typeColors: {
      noun: '#bbdefb', // Pastel blue
      verb: '#e1bee7', // Pastel purple
      adjective: '#b2ebf2', // Pastel cyan
      adverb: '#c8e6c9', // Pastel green
      preposition: '#ffe0b2', // Pastel orange
      conjunction: '#d7ccc8', // Pastel brown
      pronoun: '#cfd8dc', // Pastel blue grey
      other: '#f5f5f5', // Pastel grey
    },
    difficultyColors: {
      easy: '#c8e6c9', // Pastel green
      medium: '#ffe0b2', // Pastel orange
      hard: '#ffcdd2', // Pastel red
    },
    frequencyColors: {
      high: '#bbdefb', // Pastel blue
      medium: '#ffe0b2', // Pastel orange
      low: '#f5f5f5', // Pastel grey
    },
    defaultColor: '#f5f5f5', // Pastel grey
  }
};

const defaultThemeSettings: ThemeSettings = {
  selectedWordBgColor: '#90caf9', // Soft blue
  selectedWordTextColor: '#424242', // Dark grey for better readability on light backgrounds
  colorTheme: 'soft',
  ...colorPalettes.soft
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  themeSettings: defaultThemeSettings,
  updateThemeSettings: () => {},
  setColorTheme: () => {},
  resetThemeSettings: () => {},
});

const STORAGE_KEY = 'themeSettings_v2'; // Versioned key to avoid conflicts with old data

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Ensure all required properties exist
        if (parsed && parsed.colorTheme && parsed.typeColors && parsed.difficultyColors) {
          return parsed;
        }
      }
      return defaultThemeSettings;
    } catch (error) {
      console.error('Error loading theme settings from localStorage:', error);
      return defaultThemeSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(themeSettings));
    } catch (error) {
      console.error('Error saving theme settings to localStorage:', error);
    }
  }, [themeSettings]);

  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const setColorTheme = (theme: ColorTheme) => {
    setThemeSettings(prev => ({
      ...prev,
      colorTheme: theme,
      ...colorPalettes[theme]
    }));
  };

  const resetThemeSettings = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error removing theme settings from localStorage:', error);
    }
    setThemeSettings(defaultThemeSettings);
  };

  return (
    <ThemeContext.Provider value={{ 
      themeSettings, 
      updateThemeSettings, 
      setColorTheme,
      resetThemeSettings
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 