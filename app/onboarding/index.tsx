import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  Brain,
  Target,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react-native';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';
import { educationLevels, fieldsOfStudy, courses, subjectsByCourse } from '@/constants/data';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'StudyPilot AI',
    description: 'Your all-in-one AI-powered academic assistant. Manage assignments, create presentations, build study plans, and ace your exams.',
    icon: BookOpen,
    gradient: Gradients.primary,
  },
  {
    id: '2',
    title: 'AI-Powered Learning',
    description: 'Generate quizzes, flashcards, and simplified notes instantly. Get personalized study plans tailored to your goals.',
    icon: Brain,
    gradient: Gradients.secondary,
  },
  {
    id: '3',
    title: 'Track Your Progress',
    description: 'Monitor study streaks, track deadlines, and celebrate achievements with gamified learning experiences.',
    icon: Target,
    gradient: Gradients.accent,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { saveProfile } = useUserProfile();
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    educationLevel: '',
    course: '',
    grade: '',
    fieldOfStudy: '',
  });
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      setShowForm(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleComplete = async () => {
    if (!formData.fullName || !formData.email || !formData.educationLevel) return;
    await saveProfile({
      ...formData,
      onboardingComplete: true,
    });
    router.replace('/(tabs)');
  };

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surface : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];

  const renderSlide = ({ item }: { item: typeof slides[0] }) => {
    const Icon = item.icon;
    return (
      <View style={[styles.slide, { backgroundColor: bg }]}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={item.gradient}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon size={64} color="#FFFFFF" strokeWidth={1.5} />
          </LinearGradient>
        </View>
        <Text style={[styles.slideTitle, { color: textPrimary }]}>{item.title}</Text>
        <Text style={[styles.slideDescription, { color: textSecondary }]}>{item.description}</Text>
      </View>
    );
  };

  if (showForm) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: bg }]}
      >
        <ScrollView
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <LinearGradient colors={Gradients.primary} style={styles.formHeaderIcon}>
              <GraduationCap size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.formTitle, { color: textPrimary }]}>Let&apos;s get to know you</Text>
            <Text style={[styles.formSubtitle, { color: textSecondary }]}>
              Personalize your StudyPilot AI experience
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? DarkColors.textSecondary : Colors.neutral[700] }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? DarkColors.textSecondary : Colors.neutral[700] }]}>Email Address *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? DarkColors.textSecondary : Colors.neutral[700] }]}>Education Level *</Text>
            <View style={styles.chipContainer}>
              {educationLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    formData.educationLevel === level && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, educationLevel: level })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.educationLevel === level && styles.chipTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? DarkColors.textSecondary : Colors.neutral[700] }]}>Course *</Text>
            <View style={styles.chipContainer}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={[
                    styles.chip,
                    formData.course === course && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, course })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.course === course && styles.chipTextActive,
                    ]}
                  >
                    {course}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? DarkColors.textSecondary : Colors.neutral[700] }]}>Current Grade/Semester (Optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="e.g., 3rd Semester"
              value={formData.grade}
              onChangeText={(text) => setFormData({ ...formData, grade: text })}
              placeholderTextColor={Colors.neutral[400]}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? DarkColors.textSecondary : Colors.neutral[700] }]}>Field of Study (Optional)</Text>
            <View style={styles.chipContainer}>
              {fieldsOfStudy.map((field) => (
                <TouchableOpacity
                  key={field}
                  style={[
                    styles.chip,
                    formData.fieldOfStudy === field && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, fieldOfStudy: field })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.fieldOfStudy === field && styles.chipTextActive,
                    ]}
                  >
                    {field}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.completeButton,
              (!formData.fullName || !formData.email || !formData.educationLevel || !formData.course) &&
                styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!formData.fullName || !formData.email || !formData.educationLevel || !formData.course}
          >
            <LinearGradient
              colors={Gradients.primary}
              style={styles.completeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.completeButtonText}>Get Started</Text>
              <Sparkles size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          {currentIndex > 0 && (
            <TouchableOpacity style={[styles.backButton, { backgroundColor: cardBg }]} onPress={handleBack}>
              <ChevronLeft size={24} color={textSecondary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <LinearGradient
              colors={Gradients.primary}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextButtonText}>
                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
  },
  iconContainer: {
    marginBottom: Spacing['3xl'],
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: BorderRadius['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  slideTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  slideDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[300],
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary[500],
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flex: 1,
    maxWidth: 280,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  formContainer: {
    padding: Spacing['2xl'],
    paddingTop: Spacing['5xl'],
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  formHeaderIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginTop: Spacing.lg,
  },
  formSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  chipActive: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.neutral[600],
  },
  chipTextActive: {
    color: Colors.primary[600],
  },
  completeButton: {
    marginTop: Spacing.xl,
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  completeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
