import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Plus, Circle, CheckCircle, Clock, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

export default function PlannerTabScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [plans, setPlans] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date().getDate();
  const isTodayMonth = month === new Date().getMonth() && year === new Date().getFullYear();

  const loadData = useCallback(async () => {
    if (!user) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
    const { data } = await supabase.from('study_plans').select('*').eq('user_id', user.id).eq('plan_date', dateStr).order('scheduled_time', { ascending: true });
    setPlans(data || []);
  }, [user, year, month, selectedDate]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function toggleComplete(id: string, current: boolean) {
    await supabase.from('study_plans').update({ completed: !current }).eq('id', id);
    await loadData();
  }

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Planner</Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => setCurrentMonth(new Date(year, month - 1, 1))} style={[styles.monthButton, { backgroundColor: cardBg }]}>
            <ChevronLeft size={20} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: textPrimary }]}>{monthNames[month]} {year}</Text>
          <TouchableOpacity onPress={() => setCurrentMonth(new Date(year, month + 1, 1))} style={[styles.monthButton, { backgroundColor: cardBg }]}>
            <ChevronRight size={20} color={textSecondary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}>
        <View style={[styles.calendarCard, { backgroundColor: cardBg }]}>
          <View style={styles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <Text key={i} style={[styles.weekDayText, { color: textMuted }]}>{d}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {Array.from({ length: firstDay }).map((_, i) => <View key={`e${i}`} style={styles.dayCell} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = day === selectedDate;
              const isTodayDate = isTodayMonth && day === today;
              return (
                <TouchableOpacity key={day} style={[styles.dayCell, isSelected && { backgroundColor: Colors.primary[500], borderRadius: BorderRadius.full }, isTodayDate && !isSelected && { borderWidth: 2, borderColor: Colors.primary[500], borderRadius: BorderRadius.full }]} onPress={() => setSelectedDate(day)}>
                  <Text style={[styles.dayText, { color: isDark ? DarkColors.textPrimary : Colors.neutral[800] }, isSelected && { color: '#FFFFFF', fontFamily: 'Inter-Bold' }, isTodayDate && !isSelected && { fontFamily: 'Inter-Bold', color: Colors.primary[600] }]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Plans for {monthNames[month]} {selectedDate}</Text>
          </View>
          {plans.map((p, i) => (
            <Animated.View key={p.id} entering={FadeInUp.delay(i * 100).duration(500)}>
              <View style={[styles.planCard, { backgroundColor: cardBg }]}>
                <View style={styles.planLeft}>
                  <TouchableOpacity onPress={() => toggleComplete(p.id, p.completed)}>
                    {p.completed ? <CheckCircle size={22} color={Colors.success[500]} /> : <Circle size={22} color={textMuted} />}
                  </TouchableOpacity>
                  <View>
                    <Text style={[styles.planTitle, { color: textPrimary }, p.completed && { textDecorationLine: 'line-through', color: textMuted }]}>{p.title}</Text>
                    <Text style={[styles.planSubject, { color: textSecondary }]}>{p.subject}</Text>
                  </View>
                </View>
                <View style={styles.planRight}>
                  <Clock size={14} color={textMuted} />
                  <Text style={[styles.planTime, { color: textMuted }]}>{p.scheduled_time}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
          {plans.length === 0 && (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: textMuted }]}>No plans for this date</Text>
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-Bold', fontSize: 28, marginBottom: Spacing.lg },
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthButton: { width: 36, height: 36, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  monthText: { fontFamily: 'Inter-Bold', fontSize: 16 },
  calendarCard: { borderRadius: BorderRadius.xl, marginHorizontal: Spacing['2xl'], padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  weekDays: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Spacing.md },
  weekDayText: { fontFamily: 'Inter-Medium', fontSize: 12, width: 36, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', height: 44, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontFamily: 'Inter-Regular', fontSize: 14 },
  section: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: 'Inter-Bold', fontSize: 18 },
  planCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  planTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  planSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  planRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planTime: { fontFamily: 'Inter-Regular', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: Spacing['2xl'] },
  emptyText: { fontFamily: 'Inter-Regular', fontSize: 14 },
});
