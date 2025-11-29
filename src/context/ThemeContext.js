/**
 * Theme Context - Dark/Light Mode Support
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import storage from '../utils/storage';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('light'); // Force light mode only
  const [isDark, setIsDark] = useState(false); // Always light mode
  
  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  // Update when system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themeMode]);
  
  const loadThemePreference = async () => {
    try {
      const saved = await storage.getItem('theme_mode');
      if (saved) {
        const mode = saved;
        setThemeMode(mode);
        if (mode === 'light') {
          setIsDark(false);
        } else if (mode === 'dark') {
          setIsDark(true);
        } else {
          setIsDark(systemColorScheme === 'dark');
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };
  
  const setTheme = async (mode) => {
    setThemeMode(mode);
    await storage.setItem('theme_mode', mode);
    
    if (mode === 'light') {
      setIsDark(false);
    } else if (mode === 'dark') {
      setIsDark(true);
    } else {
      setIsDark(systemColorScheme === 'dark');
    }
  };
  
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setTheme(newMode);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        isDark,
        themeMode,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
