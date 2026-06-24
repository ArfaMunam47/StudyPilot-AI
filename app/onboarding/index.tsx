import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  GraduationCap,
  ChevronRight,
  BookOpen,
  Brain,
  Target,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Gradients, Colors, Spacing, BorderRadius } from '@/constants/theme';

const educationLevels = ['High School', 'Undergraduate', 'Graduate', 'Postgraduate'];
const courses = [
  'BSCS - BS Computer Science',
  'BSSE - BS Software Engineering',
  'BSIT - BS Information Technology',
  'BSDS - BS Data Science',
  'BSMath - BS Mathematics',
  'BBA - Business Administration',
];

const subjectsByCourse: Record<string, string[]> = {
  'BSCS - BS Computer Science': [
    'Data Structures & Algorithms',
    'Object-Oriented Programming',
    'Database Systems',
    'Computer Networks',
    'Operating Systems',
    'Software Engineering',
    'Artificial Intelligence',
    'Web Development',
  ],
  'BSSE - BS Software Engineering': [
    'Software Design Patterns',
    'Software Quality Assurance',
    'Requirements Engineering',
    'Agile Methodologies',
    'DevOps Practices',
    'System Architecture',
    'Testing & Automation',
    'Project Management',
  ],
  'BSIT - BS Information Technology': [
    'Network Administration',
    'Cloud Computing',
    'Cybersecurity',
    'IT Project Management',
    'System Administration',
    'Web Technologies',
    'Database Management',
    'Mobile Development',
  ],
  'BSDS - BS Data Science': [
    'Statistics & Probability',
    'Machine Learning',
    'Data Visualization',
    'Big Data Analytics',
    'Python for Data Science',
    'Deep Learning',
    'Natural Language Processing',
    'Data Engineering',
  ],
  'BSMath - BS Mathematics': [
    'Calculus',
    'Linear Algebra',
    'Discrete Mathematics',
    'Differential Equations',
    'Number Theory',
    'Real Analysis',
    'Abstract Algebra',
    'Probability Theory',
  ],
  'BBA - Business Administration': [
    'Marketing Management',
    'Financial Accounting',
    'Business Strategy',
    'Organizational Behavior',
    'Economics',
    'Human Resource Management',
    'Operations Management',
    'Entrepreneurship',
  ],
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [educationLevel, setEducationLevel] = useState('');
  const [course, setCourse] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);

  const availableSubjects = course ? subjectsByCourse[course] || [] : [];

  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  async function handleComplete() {
    if (!user) return;
    setLoading(true);
    await supabase.from('user_profiles').update({
      education_level: educationLevel,
      course,
      grade,
      field_of_study: course?.split(' - ')[1] || '',
    }).eq('id', user.id);

    // Seed sample data based on course
    const subjects = selectedSubjects.length > 0 ? selectedSubjects : availableSubjects.slice(0, 3);
    const now = new Date().toISOString();

    await supabase.from('assignments').insert([
      { user_id: user.id, title: `${subjects[0]} Assignment`, subject: subjects[0], due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], status: 'pending', priority: 'high' },
      { user_id: user.id, title: `${subjects[1]} Problem Set`, subject: subjects[1], due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], status: 'pending', priority: 'medium' },
    ]);

    await supabase.from('study_plans').insert([
      { user_id: user.id, title: `${subjects[0]} Revision`, subject: subjects[0], scheduled_time: '9:00 AM - 11:00 AM', duration: '2 hours', plan_date: new Date().toISOString().split('T')[0] },
      { user_id: user.id, title: `${subjects[1]} Practice`, subject: subjects[1], scheduled_time: '2:00 PM - 4:00 PM', duration: '2 hours', plan_date: new Date().toISOString().split('T')[0] },
    ]);

    await supabase.from('flashcards').insert([
      { user_id: user.id, front: `What is the core concept of ${subjects[0]}?`, back: 'The fundamental principles and techniques covered in this subject.', subject: subjects[0] },
      { user_id: user.id, front: `Key term in ${subjects[1]}`, back: 'An important concept you need to master for this subject.', subject: subjects[1] },
    ]);

    await supabase.from('notes').insert([
      { user_id: user.id, title: `${subjects[0]} Notes`, content: 'Key concepts and definitions from this subject. Review regularly for best retention.', subject: subjects[0] },
    ]);

    setLoading(false);
    router.replace('/(tabs)');
  }

  const steps = [
    {
      icon: GraduationCap,
      title: 'Welcome to StudyPilot AI',
      description: 'Let\'s personalize your learning experience.',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepLabel}>What is your education level?</Text>
          <View style={styles.chipRow}>
            {educationLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.chip, educationLevel === level && styles.chipActive]}
                onPress={() => setEducationLevel(level)}
              >
                <Text style={[styles.chipText, educationLevel === level && styles.chipTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      icon: BookOpen,
      title: 'Select Your Course',
      description: 'This helps us tailor content to your field.',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepLabel}>What course are you enrolled in?</Text>
          <View style={styles.chipRow}>
            {courses.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, course === c && styles.chipActive]}
                onPress={() => { setCourse(c); setSelectedSubjects([]); }}
              >
                <Text style={[styles.chipText, course === c && styles.chipTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
    {
      icon: Brain,
      title: 'Your Subjects',
      description: 'Select the subjects you want to focus on.',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepLabel}>Select subjects (optional)</Text>
          <View style={styles.chipRow}>
            {availableSubjects.map((subject) => (
              <TouchableOpacity
                key={subject}
                style={[styles.chip, selectedSubjects.includes(subject) && styles.chipActive]}
                onPress={() => toggleSubject(subject)}
              >
                <Text style={[styles.chipText, selectedSubjects.includes(subject) && styles.chipTextActive]}>
                  {subject}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.stepHint}>
            We&apos;ll create sample assignments and study plans for you
          </Text>
        </View>
      ),
    },
    {
      icon: Target,
      title: 'Almost There',
      description: 'One last detail.',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepLabel}>Current semester/grade (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 3rd Semester"
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={grade}
            onChangeText={setGrade}
          />
        </View>
      ),
    },
  ];

  const current = steps[step];
  const Icon = current.icon;
  const canProceed = step === 0 ? educationLevel : step === 1 ? course : true;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient colors={Gradients.dark} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.progressDots}>
            {steps.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>

          <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
            <LinearGradient colors={Gradients.primary} style={styles.iconBg}>
              <Icon size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.description}>{current.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.content}>
            {current.content}
          </Animated.View>

          <View style={styles.footer}>
            {step > 0 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, !canProceed && { opacity: 0.5 }]}
              onPress={() => {
                if (step < steps.length - 1) setStep(step + 1);
                else handleComplete();
              }}
              disabled={!canProceed || loading}
            >
              <LinearGradient colors={Gradients.primary} style={styles.nextGradient}>
                <Text style={styles.nextText}>
                  {loading ? 'Setting up...' : step === steps.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                {!loading && <ChevronRight size={20} color="#FFFFFF" />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 60,
    paddingBottom: Spacing['2xl'],
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing['3xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary[500],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    gap: Spacing.lg,
  },
  stepLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.sm,
  },
  stepHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  chipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing['3xl'],
    gap: Spacing.md,
  },
  backBtn: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  backText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
  },
  nextBtn: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  nextText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
