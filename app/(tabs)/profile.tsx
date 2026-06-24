import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Flame, Settings, Bell, Moon, Globe, Shield, BookOpen, ChevronRight, LogOut, Trophy, Star, Zap, TrendingUp, Heart, Info, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';

export default function ProfileTabScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ tasks: 0, quizzes: 0, streak: 0 });
  const [notifications, setNotifications] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data: profileData } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
    setProfile(profileData);

    const { data: assignData } = await supabase.from('assignments').select('*').eq('user_id', user.id);
    const { data: quizData } = await supabase.from('quiz_results').select('*').eq('user_id', user.id);
    const completed = (assignData || []).filter((a) => a.status === 'completed').length;

    setStats({
      tasks: completed,
      quizzes: quizData?.length || 0,
      streak: Math.min(completed + 3, 30),
    });

    const { data: settings } = await supabase.from('app_settings').select('notifications').eq('user_id', user.id).maybeSingle();
    if (settings) setNotifications(settings.notifications);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleToggleNotifications(val: boolean) {
    setNotifications(val);
    if (user) {
      await supabase.from('app_settings').upsert({ user_id: user.id, notifications: val }, { onConflict: 'user_id' });
    }
  }

  async function handleLogout() {
    await signOut();
    router.replace('/auth/welcome');
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';
  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

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
          <View style={styles.footerCard}>
            <Heart size={16} color={Colors.error[400]} />
            <Text style={styles.footerText}>Made with love by Arfa Munam</Text>
          </View>
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
          <Text style={[styles.profileName, { color: textPrimary }]}>{profile?.full_name || 'Student'}</Text>
          <Text style={[styles.profileEmail, { color: textSecondary }]}>{profile?.email || user?.email || ''}</Text>
          <View style={styles.profileMeta}>
            <Text style={styles.profileMetaText}>{profile?.education_level || 'Student'}</Text>
            {profile?.course && <><Text style={[styles.profileMetaDot, { color: textMuted }]}>•</Text><Text style={styles.profileMetaText}>{profile.course}</Text></>}
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.statCardGradient}>
              <Flame size={24} color={Colors.error[500]} />
              <Text style={[styles.statCardValue, { color: textPrimary }]}>{stats.streak}</Text>
              <Text style={[styles.statCardLabel, { color: textSecondary }]}>Day Streak</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#F0FDF4', '#DCFCE7']} style={styles.statCardGradient}>
              <Trophy size={24} color={Colors.success[500]} />
              <Text style={[styles.statCardValue, { color: textPrimary }]}>{stats.tasks}</Text>
              <Text style={[styles.statCardLabel, { color: textSecondary }]}>Tasks</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEF2F2', '#FEE2E2']} style={styles.statCardGradient}>
              <TrendingUp size={24} color={Colors.error[500]} />
              <Text style={[styles.statCardValue, { color: textPrimary }]}>{stats.quizzes}</Text>
              <Text style={[styles.statCardLabel, { color: textSecondary }]}>Quizzes</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={[styles.settingsCard, { backgroundColor: cardBg }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}><Moon size={20} color={Colors.primary[500]} /><Text style={[styles.settingText, { color: textPrimary }]}>Dark Mode</Text></View>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }} thumbColor="#FFFFFF" />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}><Bell size={20} color={Colors.warning[500]} /><Text style={[styles.settingText, { color: textPrimary }]}>Notifications</Text></View>
              <Switch value={notifications} onValueChange={handleToggleNotifications} trackColor={{ false: Colors.neutral[300], true: Colors.primary[500] }} thumbColor="#FFFFFF" />
            </View>
            <View style={[styles.settingDivider, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[100] }]} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}><Globe size={20} color={Colors.success[500]} /><Text style={[styles.settingText, { color: textPrimary }]}>Language</Text></View>
              <Text style={[styles.settingValue, { color: textMuted }]}>English</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: cardBg }]} onPress={() => setShowAbout(true)}>
            <Info size={20} color={Colors.primary[500]} />
            <Text style={[styles.menuText, { color: textPrimary }]}>About StudyPilot AI</Text>
            <ChevronRight size={16} color={textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient colors={['#FEE2E2', '#FECACA']} style={styles.logoutGradient}>
              <LogOut size={20} color={Colors.error[500]} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  profileHeader: { alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  avatarText: { fontFamily: 'Inter-Bold', fontSize: 32, color: '#FFFFFF' },
  profileName: { fontFamily: 'Inter-Bold', fontSize: 22, marginTop: Spacing.md },
  profileEmail: { fontFamily: 'Inter-Regular', fontSize: 14, marginTop: Spacing.xs },
  profileMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  profileMetaText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.primary[600], backgroundColor: Colors.primary[50], paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full },
  profileMetaDot: { fontFamily: 'Inter-Regular', fontSize: 14 },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'], gap: Spacing.md },
  statCard: { flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statCardGradient: { borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center' },
  statCardValue: { fontFamily: 'Inter-Bold', fontSize: 20, marginTop: Spacing.sm },
  statCardLabel: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 2 },
  menuSection: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'], gap: Spacing.md },
  settingsCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingText: { fontFamily: 'Inter-Regular', fontSize: 15 },
  settingValue: { fontFamily: 'Inter-Medium', fontSize: 14 },
  settingDivider: { height: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, gap: Spacing.md },
  menuText: { fontFamily: 'Inter-SemiBold', fontSize: 15, flex: 1 },
  logoutButton: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  logoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, borderRadius: BorderRadius.xl, gap: Spacing.sm },
  logoutText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.error[500] },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing['3xl'], paddingHorizontal: Spacing['2xl'] },
  footerText: { fontFamily: 'Inter-Regular', fontSize: 12 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  detailTitle: { fontFamily: 'Inter-Bold', fontSize: 18, flex: 1, textAlign: 'center', marginHorizontal: Spacing.md },
  detailContent: { flex: 1, paddingHorizontal: Spacing['2xl'], paddingTop: Spacing.lg },
  aboutHero: { borderRadius: BorderRadius['3xl'], padding: Spacing['3xl'], alignItems: 'center', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 12, marginBottom: Spacing['2xl'] },
  aboutHeroTitle: { fontFamily: 'Inter-Bold', fontSize: 28, color: '#FFFFFF' },
  aboutHeroVersion: { fontFamily: 'Inter-Regular', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
  aboutCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  aboutSectionTitle: { fontFamily: 'Inter-Bold', fontSize: 16, marginBottom: Spacing.md },
  creatorRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  creatorAvatar: { width: 56, height: 56, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  creatorAvatarText: { fontFamily: 'Inter-Bold', fontSize: 20, color: '#FFFFFF' },
  creatorName: { fontFamily: 'Inter-Bold', fontSize: 18 },
  creatorRole: { fontFamily: 'Inter-Regular', fontSize: 14, marginTop: 2 },
  aboutText: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },
  footerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing.lg, paddingVertical: Spacing.lg },
});
