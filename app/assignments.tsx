import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, FileText, Plus, CheckCircle, Circle, Clock, Tag, ChevronRight, X,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

export default function AssignmentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', subject: '', instructions: '', dueDate: '', priority: 'medium' });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('assignments').select('*').eq('user_id', user.id).order('due_date', { ascending: true });
    setAssignments(data || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleAdd() {
    if (!formData.title || !formData.subject || !user) return;
    setLoading(true);
    await supabase.from('assignments').insert({
      user_id: user.id,
      title: formData.title,
      subject: formData.subject,
      instructions: formData.instructions,
      due_date: formData.dueDate || null,
      priority: formData.priority,
      status: 'pending',
    });
    setFormData({ title: '', subject: '', instructions: '', dueDate: '', priority: 'medium' });
    setShowForm(false);
    await loadData();
    setLoading(false);
  }

  async function toggleStatus(id: string, current: string) {
    const newStatus = current === 'completed' ? 'pending' : 'completed';
    await supabase.from('assignments').update({ status: newStatus }).eq('id', id);
    await loadData();
  }

  async function deleteAssignment(id: string) {
    await supabase.from('assignments').delete().eq('id', id);
    await loadData();
  }

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const getPriorityColor = (p: string) => p === 'high' ? Colors.error[500] : p === 'medium' ? Colors.warning[500] : Colors.success[500];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Assignments</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>New Assignment</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Title" placeholderTextColor={textMuted} value={formData.title} onChangeText={(t) => setFormData({ ...formData, title: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Subject" placeholderTextColor={textMuted} value={formData.subject} onChangeText={(t) => setFormData({ ...formData, subject: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Due date (YYYY-MM-DD)" placeholderTextColor={textMuted} value={formData.dueDate} onChangeText={(t) => setFormData({ ...formData, dueDate: t })} />
            <View style={styles.priorityRow}>
              {['low', 'medium', 'high'].map((p) => (
                <TouchableOpacity key={p} style={[styles.priorityChip, formData.priority === p && { backgroundColor: getPriorityColor(p) }]} onPress={() => setFormData({ ...formData, priority: p })}>
                  <Text style={[styles.priorityText, formData.priority === p && { color: '#FFFFFF' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.submitBtn, loading && { opacity: 0.6 }]} onPress={handleAdd} disabled={loading}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>{loading ? 'Adding...' : 'Add Assignment'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {assignments.map((a, i) => (
          <Animated.View key={a.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardTop}>
                <TouchableOpacity onPress={() => toggleStatus(a.id, a.status)}>
                  {a.status === 'completed' ? <CheckCircle size={22} color={Colors.success[500]} /> : <Circle size={22} color={textMuted} />}
                </TouchableOpacity>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: textPrimary }, a.status === 'completed' && { textDecorationLine: 'line-through', color: textMuted }]}>{a.title}</Text>
                  <Text style={[styles.cardSubject, { color: textSecondary }]}>{a.subject}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteAssignment(a.id)}>
                  <X size={18} color={textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.cardBottom}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(a.priority) + '20' }]}>
                  <Text style={[styles.priorityBadgeText, { color: getPriorityColor(a.priority) }]}>{a.priority}</Text>
                </View>
                {a.due_date && (
                  <View style={styles.dueRow}>
                    <Clock size={14} color={textMuted} />
                    <Text style={[styles.dueText, { color: textMuted }]}>{a.due_date}</Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        ))}

        {assignments.length === 0 && !showForm && (
          <View style={styles.empty}>
            <FileText size={48} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>No assignments yet</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>Tap + to add your first assignment</Text>
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
  priorityRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  priorityChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.neutral[100] },
  priorityText: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.neutral[600] },
  submitBtn: { borderRadius: BorderRadius.xl, overflow: 'hidden' },
  submitGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  submitText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' },
  card: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  cardInfo: { flex: 1 },
  cardTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  cardSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.md, marginLeft: 34 },
  priorityBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full },
  priorityBadgeText: { fontFamily: 'Inter-Medium', fontSize: 11 },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dueText: { fontFamily: 'Inter-Regular', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 16, marginTop: Spacing.lg },
  emptySub: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.xs },
});
