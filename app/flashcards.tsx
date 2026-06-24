import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, Plus, RotateCw, Check, ChevronLeft, ChevronRight, X, Layers,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ front: '', back: '', subject: '' });
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('flashcards').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setFlashcards(data || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleAdd() {
    if (!formData.front || !formData.back || !user) return;
    await supabase.from('flashcards').insert({
      user_id: user.id, front: formData.front, back: formData.back, subject: formData.subject || 'General',
    });
    setFormData({ front: '', back: '', subject: '' });
    setShowForm(false);
    await loadData();
  }

  async function toggleMastered(id: string, current: boolean) {
    await supabase.from('flashcards').update({ mastered: !current }).eq('id', id);
    await loadData();
  }

  async function deleteCard(id: string) {
    await supabase.from('flashcards').delete().eq('id', id);
    await loadData();
  }

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  if (studyMode && flashcards.length > 0) {
    const card = flashcards[currentIndex];
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
          <TouchableOpacity onPress={() => { setStudyMode(false); setFlipped(false); setCurrentIndex(0); }} style={styles.backBtn}>
            <ArrowLeft size={24} color={textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Study Mode</Text>
          <Text style={[styles.progressText, { color: textMuted }]}>{currentIndex + 1}/{flashcards.length}</Text>
        </LinearGradient>

        <View style={styles.studyBody}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setFlipped(!flipped)} style={[styles.flipCard, { backgroundColor: cardBg }]}>
            <LinearGradient colors={flipped ? Gradients.secondary : Gradients.primary} style={styles.flipCardInner}>
              <Text style={styles.flipText}>{flipped ? card.back : card.front}</Text>
              <Text style={styles.flipHint}>{flipped ? 'Back' : 'Front'} — tap to flip</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.studyControls}>
            <TouchableOpacity onPress={() => { setFlipped(false); setCurrentIndex(Math.max(0, currentIndex - 1)); }} style={styles.studyBtn}>
              <ChevronLeft size={28} color={textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleMastered(card.id, card.mastered)} style={[styles.masterBtn, card.mastered && { backgroundColor: Colors.success[500] }]}>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.masterText}>{card.mastered ? 'Mastered' : 'Mark Mastered'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFlipped(false); setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1)); }} style={styles.studyBtn}>
              <ChevronRight size={28} color={textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Flashcards</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>New Flashcard</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Front (question/term)" placeholderTextColor={textMuted} value={formData.front} onChangeText={(t) => setFormData({ ...formData, front: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Back (answer/definition)" placeholderTextColor={textMuted} value={formData.back} onChangeText={(t) => setFormData({ ...formData, back: t })} />
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Subject (optional)" placeholderTextColor={textMuted} value={formData.subject} onChangeText={(t) => setFormData({ ...formData, subject: t })} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Add Flashcard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {flashcards.length > 0 && (
          <TouchableOpacity style={[styles.studyModeBtn, { backgroundColor: cardBg }]} onPress={() => { setStudyMode(true); setFlipped(false); setCurrentIndex(0); }}>
            <LinearGradient colors={Gradients.primary} style={styles.studyModeGradient}>
              <Layers size={20} color="#FFFFFF" />
              <Text style={styles.studyModeText}>Study Mode ({flashcards.length} cards)</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {flashcards.map((card, i) => (
          <Animated.View key={card.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardFront, { color: textPrimary }]}>{card.front}</Text>
                  <Text style={[styles.cardBack, { color: textSecondary }]}>{card.back}</Text>
                  <Text style={[styles.cardSubject, { color: textMuted }]}>{card.subject}</Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => toggleMastered(card.id, card.mastered)}>
                    <Check size={18} color={card.mastered ? Colors.success[500] : textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteCard(card.id)}>
                    <X size={18} color={textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}

        {flashcards.length === 0 && !showForm && (
          <View style={styles.empty}>
            <Layers size={48} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>No flashcards yet</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>Tap + to create your first card</Text>
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
  progressText: { fontFamily: 'Inter-Medium', fontSize: 14 },
  addBtn: { shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addGradient: { width: 40, height: 40, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  formCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  formTitle: { fontFamily: 'Inter-Bold', fontSize: 16, marginBottom: Spacing.md },
  formInput: { borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, fontFamily: 'Inter-Regular', fontSize: 14, marginBottom: Spacing.sm },
  submitBtn: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginTop: Spacing.sm },
  submitGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  submitText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' },
  studyModeBtn: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, overflow: 'hidden', marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  studyModeGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, gap: Spacing.sm },
  studyModeText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' },
  card: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardContent: { flex: 1 },
  cardFront: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  cardBack: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 4 },
  cardSubject: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 4 },
  cardActions: { gap: Spacing.md, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 16, marginTop: Spacing.lg },
  emptySub: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.xs },
  studyBody: { flex: 1, paddingHorizontal: Spacing['2xl'], paddingTop: Spacing['2xl'] },
  flipCard: { borderRadius: BorderRadius['3xl'], overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
  flipCardInner: { padding: Spacing['3xl'], minHeight: 280, justifyContent: 'center', alignItems: 'center' },
  flipText: { fontFamily: 'Inter-Bold', fontSize: 20, color: '#FFFFFF', textAlign: 'center', lineHeight: 28 },
  flipHint: { fontFamily: 'Inter-Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.lg },
  studyControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing['3xl'] },
  studyBtn: { width: 48, height: 48, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  masterBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.success[500], paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.lg, borderRadius: BorderRadius.full },
  masterText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#FFFFFF' },
});
