import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  CheckCircle,
  Circle,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';
import { sampleAssignments } from '@/constants/data';

export default function PlannerTabScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(1);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(1);
  };

  const today = new Date().getDate();
  const isTodayMonth = month === new Date().getMonth() && year === new Date().getFullYear();

  const deadlinesForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sampleAssignments.filter((a) => a.dueDate === dateStr);
  };

  const selectedDeadlines = deadlinesForDate(selectedDate);

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
          <TouchableOpacity onPress={prevMonth} style={[styles.monthButton, { backgroundColor: cardBg }]}>
            <ChevronLeft size={20} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.monthText, { color: textPrimary }]}>
            {monthNames[month]} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={[styles.monthButton, { backgroundColor: cardBg }]}>
            <ChevronRight size={20} color={textSecondary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.calendarCard, { backgroundColor: cardBg }]}>
          <View style={styles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <Text key={i} style={[styles.weekDayText, { color: textMuted }]}>{day}</Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasDeadlines = deadlinesForDate(day).length > 0;
              const isSelected = day === selectedDate;
              const isTodayDate = isTodayMonth && day === today;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && { backgroundColor: Colors.primary[500], borderRadius: BorderRadius.full },
                    isTodayDate && { borderWidth: 2, borderColor: Colors.primary[500], borderRadius: BorderRadius.full },
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isDark ? DarkColors.textPrimary : Colors.neutral[800] },
                      isSelected && { color: '#FFFFFF', fontFamily: 'Inter-Bold' },
                      isTodayDate && !isSelected && { fontFamily: 'Inter-Bold', color: Colors.primary[600] },
                    ]}
                  >
                    {day}
                  </Text>
                  {hasDeadlines && (
                    <View style={[
                      styles.dayDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : Colors.error[500] },
                    ]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>
              {monthNames[month]} {selectedDate}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/planner')}
            >
              <LinearGradient colors={Gradients.primary} style={styles.addButtonGradient}>
                <Plus size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {selectedDeadlines.length > 0 ? (
            selectedDeadlines.map((deadline, index) => (
              <Animated.View
                key={deadline.id}
                entering={FadeInUp.delay(index * 100).duration(400)}
              >
                <View style={[styles.deadlineCard, { backgroundColor: cardBg }]}>
                  <View style={styles.deadlineLeft}>
                    <View
                      style={[
                        styles.priorityDot,
                        {
                          backgroundColor:
                            deadline.priority === 'high'
                              ? Colors.error[500]
                              : deadline.priority === 'medium'
                              ? Colors.warning[500]
                              : Colors.success[500],
                        },
                      ]}
                    />
                    <View>
                      <Text style={[styles.deadlineTitle, { color: textPrimary }]}>{deadline.title}</Text>
                      <Text style={[styles.deadlineSubject, { color: textSecondary }]}>{deadline.subject}</Text>
                    </View>
                  </View>
                  <View style={styles.deadlineRight}>
                    {deadline.status === 'completed' ? (
                      <CheckCircle size={20} color={Colors.success[500]} />
                    ) : (
                      <AlertTriangle
                        size={20}
                        color={
                          deadline.priority === 'high'
                            ? Colors.error[500]
                            : Colors.warning[500]
                        }
                      />
                    )}
                  </View>
                </View>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={40} color={textMuted} />
              <Text style={[styles.emptyText, { color: textMuted }]}>No deadlines on this date</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Weekly Overview</Text>
          {['Study Plan', 'Assignment Review', 'Quiz Practice', 'Flashcard Review'].map(
            (task, i) => (
              <Animated.View
                key={i}
                entering={FadeInUp.delay(i * 100).duration(400)}
              >
                <View style={[styles.weekTask, { backgroundColor: cardBg }]}>
                  <Circle size={20} color={textMuted} />
                  <Text style={[styles.weekTaskText, { color: textSecondary }]}>{task}</Text>
                  <Text style={[styles.weekTaskTime, { color: Colors.primary[500] }]}>
                    {['9:00 AM', '2:00 PM', '4:00 PM', '7:00 PM'][i]}
                  </Text>
                </View>
              </Animated.View>
            )
          )}
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: Spacing.lg,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  monthText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  calendarCard: {
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing['2xl'],
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  weekDayText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  dayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: BorderRadius.full,
  },
  section: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  addButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deadlineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
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
  },
  priorityDot: {
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
    alignItems: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: Spacing.md,
  },
  weekTask: {
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
  weekTaskText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
  },
  weekTaskTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});
