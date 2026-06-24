import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Gradients, Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message || 'Invalid email or password');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={Gradients.dark} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.form}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Mail size={18} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Lock size={18} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} color="rgba(255,255,255,0.5)" /> : <Eye size={18} color="rgba(255,255,255,0.5)" />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={handleSignIn} disabled={loading}>
              <LinearGradient colors={Gradients.primary} style={styles.primaryGradient}>
                <Text style={styles.primaryText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/signup')} style={styles.switchLink}>
              <Text style={styles.switchText}>Don't have an account? <Text style={styles.switchHighlight}>Sign Up</Text></Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing['2xl'], paddingTop: 60, paddingBottom: Spacing['2xl'] },
  backButton: { width: 40, height: 40, borderRadius: BorderRadius.full, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing['2xl'] },
  header: { marginBottom: Spacing['3xl'] },
  title: { fontFamily: 'Inter-Bold', fontSize: 32, color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontFamily: 'Inter-Regular', fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.sm },
  form: { gap: Spacing.lg },
  errorText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.error[400], textAlign: 'center', backgroundColor: 'rgba(239,68,68,0.1)', padding: Spacing.md, borderRadius: BorderRadius.lg },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: Spacing.sm },
  input: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 15, color: '#FFFFFF' },
  primaryButton: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginTop: Spacing.md },
  primaryGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  primaryText: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#FFFFFF' },
  switchLink: { alignItems: 'center', marginTop: Spacing.md },
  switchText: { fontFamily: 'Inter-Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  switchHighlight: { fontFamily: 'Inter-SemiBold', color: Colors.primary[400] },
});
