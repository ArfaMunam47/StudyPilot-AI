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
  Calendar,
  Plus,
  Clock,
  Target,
  CheckCircle,
  Circle,
  AlertTriangle,
  BookOpen,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';
import { sampleStudyPlans } from '@/constants/data';

interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  time: string;
  duration: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function PlannerScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [plans, setPlans] = useState<StudyPlan[]>(sampleStudyPlans.map(p => ({ ...p, priority: 'medium' as const })));
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    time: '',
    duration: '',
  });
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleAdd = () => {
    if (!formData.title || !formData.subject) return;
    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      time: formData.time || '9:00 AM',
      duration: formData.duration || '1 hour',
      completed: false,
      priority: 'medium',
    };
    setPlans([newPlan, ...plans]);
    setFormData({ title: '', subject: '', time: '', duration: '' });
    setShowForm(false);
  };

  const toggleComplete = (id: string) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={14} color={Colors.error[500]} />;
      case 'medium': return <Target size={14} color={Colors.warning[500]} />;
      default: return <BookOpen size={14} color={Colors.success[500]} />;
    }
  };

  const weeklySchedule = [
    { day: 'Mon', plans: plans.slice(0, 2) },
    { day: 'Tue', plans: [plans[2]] },
    { day: 'Wed', plans: [] },
    { day: 'Thu', plans: plans.slice(0, 1) },
    { day: 'Fri', plans: plans.slice(1, 3) },
    { day: 'Sat', plans: [] },
    { day: 'Sun', plans: [plans[0]] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: cardBg }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Study Planner</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addButton}>
            <LinearGradient colors={Gradients.primary} style={styles.addButtonGradient}>
              <Plus size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={[styles.tabRow, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[100] }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'daily' && [styles.tabActive, { backgroundColor: cardBg }]]}
            onPress={() => setActiveTab('daily')}
          >
            <Text style={[styles.tabText, { color: textSecondary }, activeTab === 'daily' && [styles.tabTextActive, { color: Colors.primary[600] }]]}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'weekly' && [styles.tabActive, { backgroundColor: cardBg }]]}
            onPress={() => setActiveTab('weekly')}
          >
            <Text style={[styles.tabText, { color: textSecondary }, activeTab === 'weekly' && [styles.tabTextActive, { color: Colors.primary[600] }]]}>
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showForm && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.formTitle, { color: textPrimary }]}>Add Study Session</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="What will you study?"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Subject"
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Time (e.g., 9:00 AM)"
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Duration (e.g., 2 hours)"
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Add to Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'daily' ? (
          <>
            <View style={styles.todayCard}>
              <LinearGradient colors={Gradients.primary} style={styles.todayGradient}>
                <Calendar size={32} color="#FFFFFF" />
                <Text style={styles.todayTitle}>Today&apos;s Focus</Text>
                <Text style={styles.todayDesc}>
                  {plans.filter((p) => !p.completed).length} sessions remaining
                </Text>
                <View style={styles.todayProgress}>
                  <View style={styles.todayProgressBar}>
                    <View
                      style={[
                        styles.todayProgressFill,
                        {
                          width: `${
                            plans.length > 0
                              ? (plans.filter((p) => p.completed).length / plans.length) * 100
                              : 0
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.todayProgressText}>
                    {plans.filter((p) => p.completed).length}/{plans.length} completed
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Study Sessions</Text>

            {plans.map((plan, index) => (
              <Animated.View key={plan.id} entering={FadeInUp.delay(index * 100).duration(400)}>
                <View style={[styles.planCard, { backgroundColor: cardBg }]}>
                  <TouchableOpacity onPress={() => toggleComplete(plan.id)}>
                    {plan.completed ? (
                      <CheckCircle size={24} color={Colors.success[500]} />
                    ) : (
                      <Circle size={24} color={textMuted} />
                    )}
                  </TouchableOpacity>
                  <View style={styles.planInfo}>
                    <Text
                      style={[
                        styles.planTitle,
                        { color: textPrimary },
                        plan.completed && [styles.planTitleCompleted, { color: textMuted }],
                      ]}
                    >
                      {plan.title}
                    </Text>
                    <View style={styles.planMeta}>
                      <BookOpen size={14} color={textMuted} />
                      <Text style={[styles.metaText, { color: textSecondary }]}>{plan.subject}</Text>
                      <Clock size={14} color={textMuted} />
                      <Text style={[styles.metaText, { color: textSecondary }]}>{plan.time}</Text>
                    </View>
                  </View>
                  <View style={styles.planRight}>
                    {getPriorityIcon(plan.priority)}
                    <Text style={[styles.durationText, { color: Colors.primary[500] }]}>{plan.duration}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Weekly Schedule</Text>
            {weeklySchedule.map((day, index) => (
              <Animated.View
                key={day.day}
                entering={FadeInUp.delay(index * 100).duration(400)}
              >
                <View style={[styles.weekDayCard, { backgroundColor: cardBg }]}>
                  <View style={styles.weekDayHeader}>
                    <Text style={[styles.weekDayName, { color: textPrimary }]}>{day.day}</Text>
                    <Text style={[styles.weekDayCount, { color: textSecondary }]}>
                      {day.plans.length} sessions
                    </Text>
                  </View>
                  {day.plans.length > 0 ? (
                    day.plans.map((plan) => (
                      <View key={plan.id} style={styles.weekPlanItem}>
                        <View style={styles.weekPlanDot} />
                        <Text style={[styles.weekPlanText, { color: textSecondary }]}>{plan.title}</Text>
                        <Text style={[styles.weekPlanTime, { color: Colors.primary[500] }]}>{plan.time}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.noPlansText, { color: textMuted }]}>No sessions planned</Text>
                  )}
                </View>
              </Animated.View>
            ))}
          </>
        )}

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
    marginBottom: Spacing.lg,
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
  tabRow: {
    flexDirection: 'row',
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
  },
  tabActive: {
    ...Shadows.sm,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  tabTextActive: {
    color: Colors.primary[600],
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
  todayCard: {
    marginBottom: Spacing.lg,
  },
  todayGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  todayTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  todayDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  todayProgress: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  todayProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  todayProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.full,
  },
  todayProgressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  planTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  planMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginRight: Spacing.sm,
  },
  planRight: {
    alignItems: 'center',
    gap: 2,
  },
  durationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
  },
  weekDayCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weekDayName: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
  },
  weekDayCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  weekPlanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  weekPlanDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
  },
  weekPlanText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    flex: 1,
  },
  weekPlanTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  noPlansText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
});
