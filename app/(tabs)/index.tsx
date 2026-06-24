import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Flame,
  ChevronRight,
  Clock,
  Zap,
  FileText,
  Monitor,
  Calendar,
  MessageCircle,
  HelpCircle,
  Layers,
  Scissors,
  Compass,
  TrendingUp,
  Award,
  Bot,
} from 'lucide-react-native';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';
import { motivationalQuotes, features, sampleAssignments, sampleStudyPlans, sampleAnalytics } from '@/constants/data';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { isDark } = useTheme();
  const [quote] = useState(() =>
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const firstName = profile?.fullName?.split(' ')[0] || 'Student';

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const iconMap: Record<string, React.ElementType> = {
    'file-text': FileText,
    'monitor': Monitor,
    'calendar': Calendar,
    'message-circle': MessageCircle,
    'help-circle': HelpCircle,
    'layers': Layers,
    'scissors': Scissors,
    'compass': Compass,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.headerGradient}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: textMuted }]}>{greeting},</Text>
            <Text style={[styles.name, { color: textPrimary }]}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.streakBadge}>
            <LinearGradient
              colors={Gradients.accent}
              style={styles.streakGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Flame size={18} color="#FFFFFF" />
              <Text style={styles.streakText}>{sampleAnalytics.currentStreak}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <View style={[styles.quoteCard, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.primary[50], borderLeftColor: Colors.primary[500] }]}>
            <Text style={[styles.quoteText, { color: isDark ? Colors.primary[300] : Colors.primary[700] }]}>&ldquo;{quote}&rdquo;</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Today&apos;s Progress</Text>
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>View All</Text>
            <ChevronRight size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.statGradient}>
              <Clock size={24} color={Colors.primary[500]} />
              <Text style={[styles.statValue, { color: textPrimary }]}>{sampleAnalytics.totalStudyHours}h</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Study Hours</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#F0FDF4', '#DCFCE7']} style={styles.statGradient}>
              <Zap size={24} color={Colors.success[500]} />
              <Text style={[styles.statValue, { color: textPrimary }]}>{sampleAnalytics.completedTasks}</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Tasks Done</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEF2F2', '#FEE2E2']} style={styles.statGradient}>
              <TrendingUp size={24} color={Colors.error[500]} />
              <Text style={[styles.statValue, { color: textPrimary }]}>{sampleAnalytics.quizAverage}%</Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>Quiz Avg</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Upcoming Deadlines</Text>
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {sampleAssignments.slice(0, 3).map((assignment, index) => (
          <Animated.View key={assignment.id} entering={FadeInUp.delay(300 + index * 100).duration(500)}>
            <TouchableOpacity style={[styles.deadlineCard, { backgroundColor: cardBg }]}>
              <View style={styles.deadlineLeft}>
                <View
                  style={[
                    styles.deadlineDot,
                    {
                      backgroundColor:
                        assignment.priority === 'high'
                          ? Colors.error[500]
                          : assignment.priority === 'medium'
                          ? Colors.warning[500]
                          : Colors.success[500],
                    },
                  ]}
                />
                <View>
                  <Text style={[styles.deadlineTitle, { color: textPrimary }]}>{assignment.title}</Text>
                  <Text style={[styles.deadlineSubject, { color: textSecondary }]}>{assignment.subject}</Text>
                </View>
              </View>
              <View style={styles.deadlineRight}>
                <Text style={[styles.deadlineDate, { color: textMuted }]}>{assignment.dueDate}</Text>
                <ChevronRight size={16} color={textMuted} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Today&apos;s Study Plan</Text>
          <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>Full Plan</Text>
            <ChevronRight size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {sampleStudyPlans.map((plan, index) => (
          <Animated.View key={plan.id} entering={FadeInUp.delay(400 + index * 100).duration(500)}>
            <TouchableOpacity style={[styles.planCard, { backgroundColor: cardBg }]}>
              <View style={styles.planLeft}>
                <View
                  style={[
                    styles.planIndicator,
                    plan.completed && { backgroundColor: Colors.success[500], borderColor: Colors.success[500] },
                  ]}
                >
                  {plan.completed && <Zap size={14} color="#FFFFFF" />}
                </View>
                <View>
                  <Text style={[styles.planTitle, { color: textPrimary }, plan.completed && { textDecorationLine: 'line-through', color: textMuted }]}>
                    {plan.title}
                  </Text>
                  <Text style={[styles.planTime, { color: textSecondary }]}>{plan.time}</Text>
                </View>
              </View>
              <Text style={[styles.planDuration, { color: Colors.primary[500] }]}>{plan.duration}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>AI Tools</Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || FileText;
            return (
              <Animated.View
                key={feature.id}
                entering={FadeInUp.delay(500 + index * 50).duration(400)}
                style={styles.featureWrapper}
              >
                <TouchableOpacity
                  style={[styles.featureCard, { backgroundColor: cardBg }]}
                  onPress={() => router.push(`/${feature.id}` as any)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={feature.gradient}
                    style={styles.featureIconBg}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Icon size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={[styles.featureTitle, { color: textPrimary }]}>{feature.title}</Text>
                  <Text style={[styles.featureDesc, { color: textSecondary }]} numberOfLines={2}>
                    {feature.description}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Weekly Progress</Text>
        </View>
        <Animated.View entering={FadeInUp.delay(700).duration(500)} style={[styles.progressCard, { backgroundColor: cardBg }]}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>
            <Text style={[styles.progressText, { color: textSecondary }]}>78% weekly goal completed</Text>
          </View>
          <View style={styles.weeklyDays}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <View key={i} style={styles.dayItem}>
                <View
                  style={[
                    styles.dayDot,
                    i < 5 && { backgroundColor: Colors.success[500] },
                    i >= 5 && { backgroundColor: isDark ? DarkColors.border : Colors.neutral[200] },
                  ]}
                />
                <Text style={[styles.dayLabel, { color: textMuted }]}>{day}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={styles.section}>
        <Animated.View entering={FadeInUp.delay(800).duration(500)} style={[styles.achievementCard, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.warning[50], borderColor: isDark ? DarkColors.border : Colors.warning[200] }]}>
          <View style={styles.achievementLeft}>
            <Award size={24} color={Colors.warning[500]} />
            <View>
              <Text style={[styles.achievementTitle, { color: textPrimary }]}>Keep it up, {firstName}!</Text>
              <Text style={[styles.achievementDesc, { color: textSecondary }]}>
                You&apos;re on a {sampleAnalytics.currentStreak}-day streak
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.achievementButton}>
            <Text style={styles.achievementButtonText}>View</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  streakBadge: {
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  streakGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  streakText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  quoteCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderLeftWidth: 3,
  },
  quoteText: {
    fontFamily: 'Inter-Italic',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary[500],
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  deadlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  deadlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  deadlineDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
  },
  deadlineTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  deadlineSubject: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  deadlineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deadlineDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  planLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  planIndicator: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  planTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  planTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  planDuration: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  featureWrapper: {
    width: (width - Spacing['2xl'] * 2 - Spacing.md) / 2,
  },
  featureCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    lineHeight: 16,
  },
  progressCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  progressBarContainer: {
    marginBottom: Spacing.lg,
  },
  progressBarBg: {
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: Spacing.sm,
  },
  weeklyDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  dayLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
  },
  achievementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  achievementDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  achievementButton: {
    backgroundColor: Colors.warning[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  achievementButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
});
