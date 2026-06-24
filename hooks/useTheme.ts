import { useState, useEffect, createContext, useContext } from 'react';
import { Storage } from '@/utils/storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
});

export function useThemeProvider() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const saved = await Storage.getItem<ThemeMode>('@studypilot_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
    setLoaded(true);
  }

  async function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await Storage.setItem('@studypilot_theme', newTheme);
  }

  return { theme, toggleTheme, isDark: theme === 'dark', loaded };
}

export function useTheme() {
  return useContext(ThemeContext);
}
