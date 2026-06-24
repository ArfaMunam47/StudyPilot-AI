import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';
import { DarkColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const { theme, toggleTheme, isDark, loaded } = useThemeProvider();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && loaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, loaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? DarkColors.bg : '#FFFFFF'} />
    </ThemeContext.Provider>
  );
}
