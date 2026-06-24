import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, ChevronRight, Clock, Zap, FileText, Monitor, Calendar, MessageCircle, HelpCircle, Layers, Scissors, Compass, TrendingUp, Award } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';

const features = [
  { id: 'assignments', title: 'Assignments', icon: FileText, gradient: Gradients.primary, route: '/assignments' },
  { id: 'presentations', title: 'Presentations', icon: Monitor, gradient: Gradients.secondary, route: '/presentations' },
  { id: 'planner', title: 'Study Planner', icon: Calendar, gradient: Gradients.accent, route: '/planner' },
  { id: 'tutor', title: 'AI Tutor', icon: MessageCircle, gradient: ['#8B5CF6', '#A78BFA'] as const, route: '/tutor' },
  { id: 'quiz', title: 'Quiz', icon: HelpCircle, gradient: Gradients.error, route: '/quiz' },
  { id: 'flashcards', title: 'Flashcards', icon: Layers, gradient: Gradients.success, route: '/flashcards' },
  { id: 'notes', title: 'Notes', icon: Scissors, gradient: ['#F59E0B', '#FBBF24'] as const, route: '/notes' },
  { id: 'career', title: 'Career', icon: Compass, gradient: ['#EC4899', '#F472B6'] as const, route: '/career' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [stats, setStats] = useState({ studyHours: 0, tasksDone: 0, quizAvg: 0, streak: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data: profileData } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
    setProfile(profileData);

    const { data: assignData } = await supabase.from('assignments').select('*').eq('user_id', user.id).order('due_date', { ascending: true }).limit(5);
    setAssignments(assignData || []);

    const { data: planData } = await supabase.from('study_plans').select('*').eq('user_id', user.id).eq('plan_date', new Date().toISOString().split('T')[0]).order('scheduled_time', { ascending: true });
    setPlans(planData || []);

    const { data: quizData } = await supabase.from('quiz_results').select('*').eq('user_id', user.id);
    const totalScore = quizData?.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) || 0;
    const quizAvg = quizData?.length ? Math.round(totalScore / quizData.length) : 0;
    const completed = (assignData || []).filter((a) => a.status === 'completed').length + (planData || []).filter((p) => p.completed).length;

    setStats({
      studyHours: Math.round((quizData?.length || 0) * 2 + completed * 1.5),
      tasksDone: completed,
      quizAvg,
      streak: Math.min(completed + 3, 30),
    });
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const getPriorityColor = (p: string) => p === 'high' ? Colors.error[500] : p === 'medium' ? Colors.warning[500] : Colors.success[500];

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: textMuted }]}>{greeting},</Text>
            <Text style={[styles.name, { color: textPrimary }]}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.streakBadge}>
            <LinearGradient colors={Gradients.accent} style={styles.streakGradient}>
              <Flame size={16} color="#FFFFFF" />
              <Text style={styles.streakText}>{stats.streak}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <View style={[styles.quoteCard, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.primary[50], borderLeftColor: Colors.primary[500] }]}>
            <Text style={[styles.quoteText, { color: isDark ? Colors.primary[300] : Colors.primary[700] }]}>
              &ldquo;Success is the sum of small efforts, repeated day in and day out.&rdquo;
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Today's Progress</Text>
        <View style={styles.statsRow}>
          <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.statGradient}>
              <Clock size={22} color={Colors.primary[500]} />
              <Text style={[styles.statValue, { color: textPrimary }]}>{stats.studyHours}h</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Study Hours</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#F0FDF4', '#DCFCE7']} style={styles.statGradient}>
              <Zap size={22} color={Colors.success[500]} />
              <Text style={[styles.statValue, { color: textPrimary }]}>{stats.tasksDone}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Tasks Done</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEF2F2', '#FEE2E2']} style={styles.statGradient}>
              <TrendingUp size={22} color={Colors.error[500]} />
              <Text style={[styles.statValue, { color: textPrimary }]}>{stats.quizAvg}%</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Quiz Avg</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </View>

      {assignments.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Upcoming Deadlines</Text>
            <TouchableOpacity onPress={() => router.push('/assignments')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {assignments.slice(0, 3).map((a, i) => (
            <Animated.View key={a.id} entering={FadeInUp.delay(300 + i * 100).duration(500)}>
              <TouchableOpacity style={[styles.deadlineCard, { backgroundColor: cardBg }]} onPress={() => router.push('/assignments')}>
                <View style={styles.deadlineLeft}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(a.priority) }]} />
                  <View>
                    <Text style={[styles.deadlineTitle, { color: textPrimary }]}>{a.title}</Text>
                    <Text style={[styles.deadlineSubject, { color: textSecondary }]}>{a.subject}</Text>
                  </View>
                </View>
                <Text style={[styles.deadlineDate, { color: textMuted }]}>{a.due_date}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      {plans.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Today's Plan</Text>
            <TouchableOpacity onPress={() => router.push('/planner')}><Text style={styles.seeAll}>Full Plan</Text></TouchableOpacity>
          </View>
          {plans.map((p, i) => (
            <Animated.View key={p.id} entering={FadeInUp.delay(400 + i * 100).duration(500)}>
              <TouchableOpacity style={[styles.planCard, { backgroundColor: cardBg }]} onPress={() => router.push('/planner')}>
                <View style={styles.planLeft}>
                  <View style={[styles.planIndicator, p.completed && { backgroundColor: Colors.success[500], borderColor: Colors.success[500] }]}>
                    {p.completed && <Zap size={12} color="#FFFFFF" />}
                  </View>
                  <View>
                    <Text style={[styles.planTitle, { color: textPrimary }, p.completed && { textDecorationLine: 'line-through', color: textMuted }]}>{p.title}</Text>
                    <Text style={[styles.planTime, { color: textSecondary }]}>{p.scheduled_time}</Text>
                  </View>
                </View>
                <Text style={[styles.planDuration, { color: Colors.primary[500] }]}>{p.duration}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textPrimary }]}>AI Tools</Text>
        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <Animated.View key={f.id} entering={FadeInUp.delay(500 + i * 50).duration(400)} style={styles.featureWrapper}>
              <TouchableOpacity style={[styles.featureCard, { backgroundColor: cardBg }]} onPress={() => router.push(f.route as any)} activeOpacity={0.7}>
                <LinearGradient colors={f.gradient} style={styles.featureIconBg}>
                  <f.icon size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.featureTitle, { color: textPrimary }]}>{f.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Animated.View entering={FadeInUp.delay(700).duration(500)} style={[styles.achievementCard, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.warning[50], borderColor: isDark ? DarkColors.border : Colors.warning[200] }]}>
          <View style={styles.achievementLeft}>
            <Award size={22} color={Colors.warning[500]} />
            <View>
              <Text style={[styles.achievementTitle, { color: textPrimary }]}>Keep it up, {firstName}!</Text>
              <Text style={[styles.achievementDesc, { color: textSecondary }]}>You're on a {stats.streak}-day streak</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.xl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { fontFamily: 'Inter-Regular', fontSize: 14 },
  name: { fontFamily: 'Inter-Bold', fontSize: 28 },
  streakBadge: { shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  streakGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, gap: Spacing.xs },
  streakText: { fontFamily: 'Inter-Bold', fontSize: 14, color: '#FFFFFF' },
  quoteCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, borderLeftWidth: 3 },
  quoteText: { fontFamily: 'Inter-Italic', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  section: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: 'Inter-Bold', fontSize: 18 },
  seeAll: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.primary[500] },
  statsRow: { flexDirection: 'row', gap: Spacing.md },
  statCard: { flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statGradient: { borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center' },
  statValue: { fontFamily: 'Inter-Bold', fontSize: 20, marginTop: Spacing.sm },
  statLabel: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 2 },
  deadlineCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  deadlineLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  priorityDot: { width: 10, height: 10, borderRadius: BorderRadius.full },
  deadlineTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  deadlineSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  deadlineDate: { fontFamily: 'Inter-Medium', fontSize: 12 },
  planCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  planIndicator: { width: 22, height: 22, borderRadius: BorderRadius.full, borderWidth: 2, borderColor: Colors.neutral[300], justifyContent: 'center', alignItems: 'center' },
  planTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  planTime: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  planDuration: { fontFamily: 'Inter-Medium', fontSize: 12 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  featureWrapper: { width: '47%' },
  featureCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, alignItems: 'center' },
  featureIconBg: { width: 48, height: 48, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  featureTitle: { fontFamily: 'Inter-SemiBold', fontSize: 13 },
  achievementCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, gap: Spacing.md },
  achievementLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  achievementTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  achievementDesc: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
});
