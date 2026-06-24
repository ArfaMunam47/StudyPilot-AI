import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '@/constants/theme';
import { Storage } from '@/utils/storage';

export default function SplashScreen() {
  const router = useRouter();
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 800 });
    logoOpacity.value = withTiming(1, { duration: 600 });
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    taglineOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));

    const timer = setTimeout(async () => {
      const profile = await Storage.getItem<any>(Storage.KEYS.USER_PROFILE);
      if (profile?.onboardingComplete) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={styles.gradient}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <LinearGradient colors={Gradients.primary} style={styles.logoCircle}>
            <Text style={styles.logoText}>SP</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={styles.title}>StudyPilot AI</Text>
        </Animated.View>

        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>Your AI-Powered Learning Assistant</Text>
        </Animated.View>

        <Animated.View style={taglineStyle}>
          <Text style={styles.tagline}>Smart. Personalized. Always Learning.</Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Arfa Munam</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 42,
    color: '#FFFFFF',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
});
