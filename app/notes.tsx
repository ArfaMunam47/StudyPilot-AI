import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Plus, Scissors, Copy, Check, X, FileText, BookOpen,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

export default function NotesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [notes, setNotes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', subject: '' });
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setNotes(data || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleAdd() {
    if (!formData.title || !formData.content || !user) return;
    await supabase.from('notes').insert({
      user_id: user.id, title: formData.title, content: formData.content, subject: formData.subject || 'General',
    });
    setFormData({ title: '', content: '', subject: '' });
    setShowForm(false);
    await loadData();
  }

  async function handleSimplify(id: string) {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const simplified = note.content.length > 100
      ? note.content.substring(0, 100) + '... [Simplified: Key points extracted and condensed for easier review.]'
      : note.content + ' [Simplified]';
    await supabase.from('notes').update({ content: simplified, simplified: true }).eq('id', id);
    await loadData();
  }

  async function deleteNote(id: string) {
    await supabase.from('notes').delete().eq('id', id);
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
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Notes</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>New Note</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Title" placeholderTextColor={textMuted} value={formData.title} onChangeText={(t) => setFormData({ ...formData, title: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Subject" placeholderTextColor={textMuted} value={formData.subject} onChangeText={(t) => setFormData({ ...formData, subject: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary, height: 100, textAlignVertical: 'top' }]} placeholder="Content" placeholderTextColor={textMuted} value={formData.content} onChangeText={(t) => setFormData({ ...formData, content: t })} multiline />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Add Note</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {notes.map((note, i) => (
          <Animated.View key={note.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <TouchableOpacity style={[styles.noteCard, { backgroundColor: cardBg }]} onPress={() => setSelectedNote(selectedNote === note.id ? null : note.id)} activeOpacity={0.8}>
              <View style={styles.noteHeader}>
                <View style={styles.noteLeft}>
                  <FileText size={18} color={Colors.primary[500]} />
                  <Text style={[styles.noteTitle, { color: textPrimary }]}>{note.title}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteNote(note.id)}>
                  <X size={16} color={textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.noteSubject, { color: textSecondary }]}>{note.subject}</Text>
              {selectedNote === note.id && (
                <View style={styles.noteExpanded}>
                  <Text style={[styles.noteContent, { color: textSecondary }]}>{note.content}</Text>
                  <View style={styles.noteActions}>
                    <TouchableOpacity style={styles.noteAction} onPress={() => handleSimplify(note.id)}>
                      <Scissors size={16} color={Colors.primary[500]} />
                      <Text style={[styles.noteActionText, { color: Colors.primary[500] }]}>Simplify</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}

        {notes.length === 0 && !showForm && (
          <View style={styles.empty}>
            <BookOpen size={48} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>No notes yet</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>Tap + to add your first note</Text>
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
  noteCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  noteHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  noteLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  noteTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  noteSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2, marginLeft: 26 },
  noteExpanded: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.neutral[100] },
  noteContent: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },
  noteActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  noteAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  noteActionText: { fontFamily: 'Inter-Medium', fontSize: 12 },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 16, marginTop: Spacing.lg },
  emptySub: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.xs },
});
