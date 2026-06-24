import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Timer,
  Plus,
  Target,
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';

interface Exam {
  id: string;
  subject: string;
  date: string;
  confidence: 'low' | 'medium' | 'high';
  studyHours: number;
}

export default function ExamScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      subject: 'Data Structures & Algorithms',
      date: '2026-07-15',
      confidence: 'medium',
      studyHours: 40,
    },
    {
      id: '2',
      subject: 'Database Systems',
      date: '2026-07-22',
      confidence: 'high',
      studyHours: 30,
    },
  ]);
  const [formData, setFormData] = useState<{
    subject: string;
    date: string;
    confidence: 'low' | 'medium' | 'high';
    studyHours: string;
  }>({
    subject: '',
    date: '',
    confidence: 'medium',
    studyHours: '',
  });
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleAdd = () => {
    if (!formData.subject || !formData.date) return;
    const newExam: Exam = {
      id: Date.now().toString(),
      subject: formData.subject,
      date: formData.date,
      confidence: formData.confidence,
      studyHours: parseInt(formData.studyHours) || 20,
    };
    setExams([newExam, ...exams]);
    setFormData({ subject: '', date: '', confidence: 'medium', studyHours: '' });
    setShowForm(false);
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    const examDate = new Date(dateStr);
    const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getConfidenceColor = (c: string) => {
    switch (c) {
      case 'high': return Colors.success[500];
      case 'medium': return Colors.warning[500];
      default: return Colors.error[500];
    }
  };

  const currentExam = exams.find((e) => e.id === selectedExam);

  if (currentExam) {
    const daysLeft = getDaysUntil(currentExam.date);
    const dailyTarget = Math.ceil(currentExam.studyHours / Math.max(daysLeft, 1));

    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.detailHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setSelectedExam(null)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]}>{currentExam.subject} Exam</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.detailContent}>
            <Animated.View entering={FadeInUp.duration(400)}>
              <LinearGradient colors={Gradients.primary} style={styles.countdownCard}>
                <Timer size={32} color="#FFFFFF" />
                <Text style={styles.countdownValue}>{daysLeft}</Text>
                <Text style={styles.countdownLabel}>days until exam</Text>
              </LinearGradient>
            </Animated.View>

            <View style={[styles.planCard, { backgroundColor: cardBg }]}>
              <Text style={[styles.planTitle, { color: textPrimary }]}>Study Plan</Text>
              <View style={styles.planRow}>
                <View style={styles.planItem}>
                  <BookOpen size={20} color={Colors.primary[500]} />
                  <Text style={[styles.planValue, { color: textPrimary }]}>{currentExam.studyHours}h</Text>
                  <Text style={[styles.planLabel, { color: textSecondary }]}>Total Hours</Text>
                </View>
                <View style={styles.planItem}>
                  <Target size={20} color={Colors.warning[500]} />
                  <Text style={[styles.planValue, { color: textPrimary }]}>{dailyTarget}h</Text>
                  <Text style={[styles.planLabel, { color: textSecondary }]}>Daily Target</Text>
                </View>
                <View style={styles.planItem}>
                  <TrendingUp size={20} color={Colors.success[500]} />
                  <Text style={[styles.planValue, { color: textPrimary }]}>{currentExam.confidence}</Text>
                  <Text style={[styles.planLabel, { color: textSecondary }]}>Confidence</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.timelineTitle, { color: textPrimary }]}>Revision Timeline</Text>
            {Array.from({ length: Math.min(7, daysLeft) }).map((_, i) => (
              <View key={i} style={[styles.timelineItem, { backgroundColor: cardBg }]}>
                <View style={[styles.timelineLeft, { borderRightColor: isDark ? DarkColors.border : Colors.neutral[200] }]}>
                  <Text style={[styles.timelineDay, { color: Colors.primary[500] }]}>Day {i + 1}</Text>
                  <Text style={[styles.timelineDate, { color: textSecondary }]}>
                    {new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTopic, { color: textPrimary }]}>
                    {['Review core concepts', 'Practice problems', 'Mock test', 'Weak areas', 'Flashcard review', 'Final revision', 'Rest & confidence boost'][i % 7]}
                  </Text>
                  <Text style={[styles.timelineHours, { color: Colors.primary[500] }]}>{dailyTarget} hours</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tipsCard, { backgroundColor: isDark ? DarkColors.surface : Colors.warning[50], borderColor: isDark ? DarkColors.border : Colors.warning[200] }]}>
              <View style={styles.tipsHeader}>
                <AlertTriangle size={20} color={Colors.warning[500]} />
                <Text style={[styles.tipsTitle, { color: isDark ? DarkColors.warning : Colors.warning[700] }]}>Exam Tips</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={16} color={Colors.success[500]} />
                <Text style={[styles.tipText, { color: textSecondary }]}>Start with high-weightage topics</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={16} color={Colors.success[500]} />
                <Text style={[styles.tipText, { color: textSecondary }]}>Take regular breaks (Pomodoro technique)</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={16} color={Colors.success[500]} />
                <Text style={[styles.tipText, { color: textSecondary }]}>Practice past papers under timed conditions</Text>
              </View>
              <View style={styles.tipItem}>
                <CheckCircle size={16} color={Colors.success[500]} />
                <Text style={[styles.tipText, { color: textSecondary }]}>Sleep well the night before the exam</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: cardBg }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Exam Mode</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addButton}>
            <LinearGradient colors={Gradients.primary} style={styles.addButtonGradient}>
              <Plus size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showForm && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.formTitle, { color: textPrimary }]}>Add Exam</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Subject"
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Exam date (YYYY-MM-DD)"
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Total study hours needed"
              value={formData.studyHours}
              onChangeText={(text) => setFormData({ ...formData, studyHours: text })}
              keyboardType="numeric"
              placeholderTextColor={textMuted}
            />
            <Text style={[styles.label, { color: textSecondary }]}>Confidence Level</Text>
            <View style={styles.confidenceRow}>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.confidenceChip,
                    { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[100] },
                    formData.confidence === level && styles.confidenceChipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, confidence: level })}
                >
                  <Text
                    style={[
                      styles.confidenceText,
                      { color: textSecondary },
                      formData.confidence === level && styles.confidenceTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Create Exam Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Upcoming Exams</Text>

        {exams.map((exam, index) => {
          const daysLeft = getDaysUntil(exam.date);
          return (
            <Animated.View key={exam.id} entering={FadeInUp.delay(index * 100).duration(400)}>
              <TouchableOpacity
                style={[styles.examCard, { backgroundColor: cardBg }]}
                onPress={() => setSelectedExam(exam.id)}
              >
                <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEE2E2', '#FECACA']} style={styles.examIconBg}>
                  <Calendar size={28} color={Colors.error[500]} />
                </LinearGradient>
                <View style={styles.examInfo}>
                  <Text style={[styles.examSubject, { color: textPrimary }]}>{exam.subject}</Text>
                  <Text style={[styles.examDate, { color: textSecondary }]}>{exam.date}</Text>
                </View>
                <View style={styles.examRight}>
                  <View
                    style={[
                      styles.daysBadge,
                      { backgroundColor: getConfidenceColor(exam.confidence) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.daysText,
                        { color: getConfidenceColor(exam.confidence) },
                      ]}
                    >
                      {daysLeft}d
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  addButton: {
    ...Shadows.sm,
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  formTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  confidenceRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  confidenceChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  confidenceChipActive: {
    backgroundColor: Colors.primary[500],
  },
  confidenceText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  confidenceTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  submitGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  examIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examInfo: {
    flex: 1,
  },
  examSubject: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  examDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  examRight: {
    alignItems: 'flex-end',
  },
  daysBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  daysText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  detailTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  detailContent: {
    padding: Spacing['2xl'],
  },
  countdownCard: {
    borderRadius: BorderRadius['3xl'],
    padding: Spacing['3xl'],
    alignItems: 'center',
    ...Shadows.lg,
    marginBottom: Spacing['2xl'],
  },
  countdownValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 56,
    color: '#FFFFFF',
    marginTop: Spacing.lg,
  },
  countdownLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.xs,
  },
  planCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    marginBottom: Spacing['2xl'],
  },
  planTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.lg,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  planItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  planValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: Spacing.xs,
  },
  planLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
  },
  timelineTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  timelineLeft: {
    width: 80,
    borderRightWidth: 1,
    paddingRight: Spacing.md,
  },
  timelineDay: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  timelineDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: Spacing.md,
  },
  timelineTopic: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  timelineHours: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  tipsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
});
