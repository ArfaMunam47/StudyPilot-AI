import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      loadTheme();
    } else {
      setLoaded(true);
    }
  }, [user]);

  async function loadTheme() {
    const { data } = await supabase
      .from('app_settings')
      .select('dark_mode')
      .eq('user_id', user!.id)
      .maybeSingle();
    if (data) {
      setTheme(data.dark_mode ? 'dark' : 'light');
    }
    setLoaded(true);
  }

  async function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (user) {
      await supabase
        .from('app_settings')
        .upsert({ user_id: user.id, dark_mode: newTheme === 'dark' }, { onConflict: 'user_id' });
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
