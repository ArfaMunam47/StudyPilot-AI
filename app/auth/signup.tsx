import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Gradients, Colors, Spacing, BorderRadius } from '@/constants/theme';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!fullName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(error.message || 'Something went wrong');
    } else {
      router.replace('/onboarding');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your AI-powered learning journey</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.form}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <User size={18} color="rgba(255,255,255,0.5)" />
              <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="rgba(255,255,255,0.4)" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            </View>

            <View style={styles.inputGroup}>
              <Mail size={18} color="rgba(255,255,255,0.5)" />
              <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="rgba(255,255,255,0.4)" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>

            <View style={styles.inputGroup}>
              <Lock size={18} color="rgba(255,255,255,0.5)" />
              <TextInput style={styles.input} placeholder="Password (min 6 chars)" placeholderTextColor="rgba(255,255,255,0.4)" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} color="rgba(255,255,255,0.5)" /> : <Eye size={18} color="rgba(255,255,255,0.5)" />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.primaryButton, loading && { opacity: 0.6 }]} onPress={handleSignUp} disabled={loading}>
              <LinearGradient colors={Gradients.primary} style={styles.primaryGradient}>
                <Text style={styles.primaryText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/signin')} style={styles.switchLink}>
              <Text style={styles.switchText}>Already have an account? <Text style={styles.switchHighlight}>Sign In</Text></Text>
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
