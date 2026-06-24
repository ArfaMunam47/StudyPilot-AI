import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Target, Plus, AlertTriangle, CheckCircle, Clock, X, Calendar,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

export default function ExamScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [exams, setExams] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', date: '', confidence: 'medium' });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('assignments').select('*').eq('user_id', user.id).order('due_date', { ascending: true });
    setExams(data || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleAdd() {
    if (!formData.subject || !user) return;
    await supabase.from('assignments').insert({
      user_id: user.id,
      title: `${formData.subject} Exam`,
      subject: formData.subject,
      due_date: formData.date || null,
      priority: formData.confidence === 'low' ? 'high' : formData.confidence === 'medium' ? 'medium' : 'low',
      status: 'pending',
    });
    setFormData({ subject: '', date: '', confidence: 'medium' });
    setShowForm(false);
    await loadData();
  }

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const getConfidenceColor = (c: string) => c === 'low' ? Colors.error[500] : c === 'medium' ? Colors.warning[500] : Colors.success[500];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Exam Prep</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>Add Exam</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Subject" placeholderTextColor={textMuted} value={formData.subject} onChangeText={(t) => setFormData({ ...formData, subject: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Date (YYYY-MM-DD)" placeholderTextColor={textMuted} value={formData.date} onChangeText={(t) => setFormData({ ...formData, date: t })} />
            <View style={styles.confidenceRow}>
              {['low', 'medium', 'high'].map((c) => (
                <TouchableOpacity key={c} style={[styles.confidenceChip, formData.confidence === c && { backgroundColor: getConfidenceColor(c) }]} onPress={() => setFormData({ ...formData, confidence: c })}>
                  <Text style={[styles.confidenceText, formData.confidence === c && { color: '#FFFFFF' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Add Exam</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {exams.filter((e) => e.title?.includes('Exam')).map((exam, i) => (
          <Animated.View key={exam.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <View style={[styles.examCard, { backgroundColor: cardBg }]}>
              <View style={styles.examTop}>
                <View style={[styles.examIcon, { backgroundColor: getConfidenceColor(exam.priority) + '20' }]}>
                  <Target size={20} color={getConfidenceColor(exam.priority)} />
                </View>
                <View style={styles.examInfo}>
                  <Text style={[styles.examTitle, { color: textPrimary }]}>{exam.title}</Text>
                  <Text style={[styles.examSubject, { color: textSecondary }]}>{exam.subject}</Text>
                </View>
              </View>
              <View style={styles.examBottom}>
                {exam.due_date && <View style={styles.examMeta}><Calendar size={14} color={textMuted} /><Text style={[styles.examMetaText, { color: textMuted }]}>{exam.due_date}</Text></View>}
                <View style={styles.examMeta}><AlertTriangle size={14} color={getConfidenceColor(exam.priority)} /><Text style={[styles.examMetaText, { color: getConfidenceColor(exam.priority) }]}>{exam.priority} priority</Text></View>
              </View>
            </View>
          </Animated.View>
        ))}

        {exams.filter((e) => e.title?.includes('Exam')).length === 0 && !showForm && (
          <View style={styles.empty}>
            <Target size={48} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>No exams tracked</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>Tap + to add an exam</Text>
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
  confidenceRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  confidenceChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.neutral[100] },
  confidenceText: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.neutral[600] },
  submitBtn: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginTop: Spacing.sm },
  submitGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  submitText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' },
  examCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  examTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  examIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  examInfo: { flex: 1 },
  examTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  examSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  examBottom: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, marginLeft: 58 },
  examMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  examMetaText: { fontFamily: 'Inter-Regular', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 16, marginTop: Spacing.lg },
  emptySub: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.xs },
});
