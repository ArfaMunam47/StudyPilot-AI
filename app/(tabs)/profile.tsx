import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Award,
  Flame,
  Settings,
  Bell,
  Moon,
  Globe,
  Shield,
  BookOpen,
  ChevronRight,
  LogOut,
  Trophy,
  Star,
  Zap,
  TrendingUp,
  Heart,
  Info,
  Code,
} from 'lucide-react-native';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';
import { badges, sampleAnalytics } from '@/constants/data';
import { Storage } from '@/utils/storage';

export default function ProfileTabScreen() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [showBadges, setShowBadges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const firstName = profile?.fullName?.split(' ')[0] || 'Student';

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleLogout = async () => {
    await Storage.clearAll();
    router.replace('/onboarding');
  };

  if (showAbout) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setShowAbout(false)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <Info size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]}>About</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(400)}>
            <LinearGradient colors={Gradients.primary} style={styles.aboutHero}>
              <Text style={styles.aboutHeroTitle}>StudyPilot AI</Text>
              <Text style={styles.aboutHeroVersion}>Version 1.0.0</Text>
            </LinearGradient>
          </Animated.View>

          <View style={[styles.aboutCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.aboutSectionTitle, { color: textPrimary }]}>Created By</Text>
            <View style={styles.creatorRow}>
              <LinearGradient colors={Gradients.primary} style={styles.creatorAvatar}>
                <Text style={styles.creatorAvatarText}>AM</Text>
              </LinearGradient>
              <View>
                <Text style={[styles.creatorName, { color: textPrimary }]}>Arfa Munam</Text>
                <Text style={[styles.creatorRole, { color: textSecondary }]}>Founder & Developer</Text>
              </View>
            </View>
          </View>

          <View style={[styles.aboutCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.aboutSectionTitle, { color: textPrimary }]}>About StudyPilot AI</Text>
            <Text style={[styles.aboutText, { color: textSecondary }]}>
              StudyPilot AI is an intelligent learning assistant designed to help students excel in their academic journey. With AI-powered tools for assignments, quizzes, flashcards, and personalized study plans, we make learning smarter and more efficient.
            </Text>
          </View>

          <View style={[styles.aboutCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.aboutSectionTitle, { color: textPrimary }]}>Features</Text>
            {[
              'AI-Powered Assignment Assistant',
              'Smart Quiz Generator',
              'Interactive Flashcards',
              'Personalized Study Planner',
              'Career Compass',
              'Notes Simplifier',
            ].map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Zap size={16} color={Colors.primary[500]} />
                <Text style={[styles.featureRowText, { color: textSecondary }]}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footerCard}>
            <Heart size={16} color={Colors.error[400]} />
            <Text style={styles.footerText}>Made with love by Arfa Munam</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  if (showBadges) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setShowBadges(false)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <User size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]}>Achievements</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Zap size={24} color={Colors.warning[500]} />
              <Text style={[styles.statItemValue, { color: textPrimary }]}>{sampleAnalytics.totalStudyHours}h</Text>
              <Text style={[styles.statItemLabel, { color: textSecondary }]}>Study Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Flame size={24} color={Colors.error[500]} />
              <Text style={[styles.statItemValue, { color: textPrimary }]}>{sampleAnalytics.currentStreak}</Text>
              <Text style={[styles.statItemLabel, { color: textSecondary }]}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Trophy size={24} color={Colors.success[500]} />
              <Text style={[styles.statItemValue, { color: textPrimary }]}>{sampleAnalytics.completedTasks}</Text>
              <Text style={[styles.statItemLabel, { color: textSecondary }]}>Tasks Done</Text>
            </View>
          </View>

          <Text style={[styles.badgesTitle, { color: textPrimary }]}>Badges</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge, index) => (
              <Animated.View key={badge.id} entering={FadeInUp.delay(index * 50).duration(300)} style={[styles.badgeCard, { backgroundColor: cardBg }]}>
                <View style={[styles.badgeIcon, !badge.unlocked && { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
                  <Award size={28} color={badge.unlocked ? Colors.warning[500] : textMuted} />
                </View>
                <Text style={[styles.badgeName, { color: badge.unlocked ? textPrimary : textMuted }]}>{badge.name}</Text>
                <Text style={[styles.badgeDesc, { color: textSecondary }]}>{badge.description}</Text>
                {!badge.unlocked && (
                  <View style={styles.lockedOverlay}>
                    <Text style={[styles.lockedText, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>Locked</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  if (showSettings) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setShowSettings(false)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <User size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.settingsCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Moon size={20} color={Colors.primary[500]} />
                <Text style={[styles.settingText, { color: textPrimary }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={Colors.warning[500]} />
                <Text style={[styles.settingText, { color: textPrimary }]}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Globe size={20} color={Colors.success[500]} />
                <Text style={[styles.settingText, { color: textPrimary }]}>Language</Text>
              </View>
              <Text style={[styles.settingValue, { color: textMuted }]}>English</Text>
            </View>
            <View style={[styles.settingDivider, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Shield size={20} color={Colors.error[500]} />
                <Text style={[styles.settingText, { color: textPrimary }]}>Privacy</Text>
              </View>
              <ChevronRight size={16} color={textMuted} />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <BookOpen size={20} color={Colors.primary[500]} />
                <Text style={[styles.settingText, { color: textPrimary }]}>Study Preferences</Text>
              </View>
              <ChevronRight size={16} color={textMuted} />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient colors={['#FEE2E2', '#FECACA']} style={styles.logoutGradient}>
              <LogOut size={20} color={Colors.error[500]} />
              <Text style={styles.logoutText}>Reset & Start Over</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.profileHeader}>
          <LinearGradient colors={Gradients.primary} style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <Text style={[styles.profileName, { color: textPrimary }]}>{profile?.fullName || 'Student'}</Text>
          <Text style={[styles.profileEmail, { color: textSecondary }]}>{profile?.email || 'student@email.com'}</Text>
          <View style={styles.profileMeta}>
            <Text style={styles.profileMetaText}>{profile?.educationLevel || 'Student'}</Text>
            {profile?.course && (
              <>
                <Text style={[styles.profileMetaDot, { color: textMuted }]}>•</Text>
                <Text style={styles.profileMetaText}>{profile.course}</Text>
              </>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.statCardGradient}>
              <Flame size={24} color={Colors.error[500]} />
              <Text style={[styles.statCardValue, { color: textPrimary }]}>{sampleAnalytics.currentStreak}</Text>
              <Text style={[styles.statCardLabel, { color: textSecondary }]}>Day Streak</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#F0FDF4', '#DCFCE7']} style={styles.statCardGradient}>
              <Trophy size={24} color={Colors.success[500]} />
              <Text style={[styles.statCardValue, { color: textPrimary }]}>{sampleAnalytics.completedTasks}</Text>
              <Text style={[styles.statCardLabel, { color: textSecondary }]}>Tasks</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEF2F2', '#FEE2E2']} style={styles.statCardGradient}>
              <TrendingUp size={24} color={Colors.error[500]} />
              <Text style={[styles.statCardValue, { color: textPrimary }]}>{sampleAnalytics.quizAverage}%</Text>
              <Text style={[styles.statCardLabel, { color: textSecondary }]}>Quiz Avg</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: cardBg }]} onPress={() => setShowBadges(true)}>
            <Award size={20} color={Colors.warning[500]} />
            <Text style={[styles.menuText, { color: textPrimary }]}>Achievements</Text>
            <ChevronRight size={16} color={textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: cardBg }]} onPress={() => setShowSettings(true)}>
            <Settings size={20} color={textSecondary} />
            <Text style={[styles.menuText, { color: textPrimary }]}>Settings</Text>
            <ChevronRight size={16} color={textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: cardBg }]} onPress={() => setShowAbout(true)}>
            <Info size={20} color={Colors.primary[500]} />
            <Text style={[styles.menuText, { color: textPrimary }]}>About StudyPilot AI</Text>
            <ChevronRight size={16} color={textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recent Activity</Text>
          {[
            { icon: Zap, text: `Completed ${profile?.course?.includes('CS') ? 'Data Structures' : 'Study'} session`, time: '2h ago', color: Colors.primary[500] },
            { icon: Star, text: 'Scored 90% on Quiz', time: '5h ago', color: Colors.warning[500] },
            { icon: BookOpen, text: 'Reviewed 15 flashcards', time: '1d ago', color: Colors.success[500] },
          ].map((activity, i) => {
            const Icon = activity.icon;
            return (
              <Animated.View key={i} entering={FadeInUp.delay(i * 100).duration(400)}>
                <View style={[styles.activityItem, { backgroundColor: cardBg }]}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.color + '15' }]}>
                    <Icon size={16} color={activity.color} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[styles.activityText, { color: textSecondary }]}>{activity.text}</Text>
                    <Text style={[styles.activityTime, { color: textMuted }]}>{activity.time}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Heart size={14} color={Colors.error[400]} />
          <Text style={[styles.footerText, { color: textMuted }]}>Made with love by Arfa Munam</Text>
        </View>

        <View style={{ height: 100 }} />
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
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginTop: Spacing.md,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  profileMetaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary[600],
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  profileMetaDot: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
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
  statCardGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statCardValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: Spacing.sm,
  },
  statCardLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: Spacing.md,
  },
  menuText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: Spacing.md,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing['3xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing['2xl'],
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statItemValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginTop: Spacing.xs,
  },
  statItemLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  badgesTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  badgeCard: {
    width: '47%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.warning[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  badgeDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: Colors.neutral[400],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  settingsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  settingValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  settingDivider: {
    height: 1,
  },
  logoutButton: {
    marginTop: Spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.error[500],
  },
  aboutHero: {
    borderRadius: BorderRadius['3xl'],
    padding: Spacing['3xl'],
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    marginBottom: Spacing['2xl'],
  },
  aboutHeroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  aboutHeroVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  aboutCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  aboutSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  creatorAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  creatorName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  creatorRole: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  aboutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureRowText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
});
