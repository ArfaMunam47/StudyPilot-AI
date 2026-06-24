import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients, Colors, Spacing, BorderRadius } from '@/constants/theme';
import { BookOpen, Brain, Target } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={styles.gradient}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.logoSection}>
          <LinearGradient colors={Gradients.primary} style={styles.logoCircle}>
            <Text style={styles.logoText}>SP</Text>
          </LinearGradient>
          <Text style={styles.title}>StudyPilot AI</Text>
          <Text style={styles.subtitle}>Your AI-Powered Learning Assistant</Text>
        </Animated.View>

        <View style={styles.features}>
          <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.featureItem}>
            <BookOpen size={24} color="#818CF8" />
            <Text style={styles.featureText}>Smart Study Plans</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(350).duration(600)} style={styles.featureItem}>
            <Brain size={24} color="#2DD4BF" />
            <Text style={styles.featureText}>AI Tutor & Quizzes</Text>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.featureItem}>
            <Target size={24} color="#F97316" />
            <Text style={styles.featureText}>Track Your Progress</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInUp.delay(650).duration(600)} style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/signup')}
          >
            <LinearGradient colors={Gradients.primary} style={styles.primaryGradient}>
              <Text style={styles.primaryText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/signin')}
          >
            <Text style={styles.secondaryText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footer}>Created by Arfa Munam</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingTop: Spacing['5xl'],
    paddingBottom: Spacing['2xl'],
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#FFFFFF',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  features: {
    width: '100%',
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  buttons: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: Spacing['2xl'],
  },
});
