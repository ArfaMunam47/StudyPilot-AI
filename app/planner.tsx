import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Plus, CheckCircle, Circle, Clock, X, Calendar,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

export default function PlannerToolScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [plans, setPlans] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', subject: '', scheduledTime: '', duration: '' });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('study_plans').select('*').eq('user_id', user.id).order('plan_date', { ascending: false });
    setPlans(data || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleAdd() {
    if (!formData.title || !formData.subject || !user) return;
    await supabase.from('study_plans').insert({
      user_id: user.id,
      title: formData.title,
      subject: formData.subject,
      scheduled_time: formData.scheduledTime,
      duration: formData.duration,
      plan_date: new Date().toISOString().split('T')[0],
    });
    setFormData({ title: '', subject: '', scheduledTime: '', duration: '' });
    setShowForm(false);
    await loadData();
  }

  async function toggleComplete(id: string, current: boolean) {
    await supabase.from('study_plans').update({ completed: !current }).eq('id', id);
    await loadData();
  }

  async function deletePlan(id: string) {
    await supabase.from('study_plans').delete().eq('id', id);
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
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Study Planner</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addBtn}>
            <LinearGradient colors={Gradients.primary} style={styles.addGradient}>
              {showForm ? <X size={18} color="#FFFFFF" /> : <Plus size={18} color="#FFFFFF" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}>
        {showForm && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.formTitle, { color: textPrimary }]}>New Study Plan</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Title (e.g., DSA Revision)" placeholderTextColor={textMuted} value={formData.title} onChangeText={(t) => setFormData({ ...formData, title: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Subject" placeholderTextColor={textMuted} value={formData.subject} onChangeText={(t) => setFormData({ ...formData, subject: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Time (e.g., 9:00 AM - 11:00 AM)" placeholderTextColor={textMuted} value={formData.scheduledTime} onChangeText={(t) => setFormData({ ...formData, scheduledTime: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Duration (e.g., 2 hours)" placeholderTextColor={textMuted} value={formData.duration} onChangeText={(t) => setFormData({ ...formData, duration: t })} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Add Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {plans.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <View style={[styles.planCard, { backgroundColor: cardBg }]}>
              <View style={styles.planTop}>
                <TouchableOpacity onPress={() => toggleComplete(p.id, p.completed)}>
                  {p.completed ? <CheckCircle size={22} color={Colors.success[500]} /> : <Circle size={22} color={textMuted} />}
                </TouchableOpacity>
                <View style={styles.planInfo}>
                  <Text style={[styles.planTitle, { color: textPrimary }, p.completed && { textDecorationLine: 'line-through', color: textMuted }]}>{p.title}</Text>
                  <Text style={[styles.planSubject, { color: textSecondary }]}>{p.subject}</Text>
                </View>
                <TouchableOpacity onPress={() => deletePlan(p.id)}><X size={18} color={textMuted} /></TouchableOpacity>
              </View>
              <View style={styles.planBottom}>
                {p.scheduled_time && <View style={styles.planMeta}><Clock size={14} color={textMuted} /><Text style={[styles.planMetaText, { color: textMuted }]}>{p.scheduled_time}</Text></View>}
                {p.duration && <View style={styles.planMeta}><Calendar size={14} color={textMuted} /><Text style={[styles.planMetaText, { color: textMuted }]}>{p.duration}</Text></View>}
              </View>
            </View>
          </Animated.View>
        ))}

        {plans.length === 0 && !showForm && (
          <View style={styles.empty}>
            <Calendar size={48} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>No study plans yet</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>Tap + to create your first plan</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-Bold', fontSize: 24, flex: 1, textAlign: 'center' },
  addBtn: { shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addGradient: { width: 40, height: 40, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  formCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  formTitle: { fontFamily: 'Inter-Bold', fontSize: 16, marginBottom: Spacing.md },
  formInput: { borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, fontFamily: 'Inter-Regular', fontSize: 14, marginBottom: Spacing.sm },
  submitBtn: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginTop: Spacing.sm },
  submitGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  submitText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' },
  planCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  planInfo: { flex: 1 },
  planTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  planSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  planBottom: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, marginLeft: 34 },
  planMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  planMetaText: { fontFamily: 'Inter-Regular', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 16, marginTop: Spacing.lg },
  emptySub: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.xs },
});
