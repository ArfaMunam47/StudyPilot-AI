import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Scissors,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

const searchCategories = [
  { id: 'all', label: 'All' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'notes', label: 'Notes' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quizzes', label: 'Quizzes' },
];

export default function StudyTabScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [items, setItems] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [assignRes, notesRes, flashRes, quizRes] = await Promise.all([
      supabase.from('assignments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('flashcards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      supabase.from('quiz_results').select('*').eq('user_id', user.id).order('taken_at', { ascending: false }).limit(10),
    ]);

    const all = [
      ...(assignRes.data || []).map((a: any) => ({ ...a, type: 'assignments', displayTitle: a.title, subtitle: a.subject })),
      ...(notesRes.data || []).map((n: any) => ({ ...n, type: 'notes', displayTitle: n.title, subtitle: n.subject })),
      ...(flashRes.data || []).map((f: any) => ({ ...f, type: 'flashcards', displayTitle: f.front, subtitle: f.subject })),
      ...(quizRes.data || []).map((q: any) => ({ ...q, type: 'quizzes', displayTitle: q.title, subtitle: q.subject })),
    ];
    setItems(all);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = items.filter((item) => {
    const matchesSearch = item.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) || item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignments': return FileText;
      case 'notes': return BookOpen;
      case 'flashcards': return Layers;
      case 'quizzes': return HelpCircle;
      default: return BookOpen;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'assignments': return Colors.primary[500];
      case 'notes': return Colors.warning[500];
      case 'flashcards': return Colors.success[500];
      case 'quizzes': return Colors.error[500];
      default: return Colors.primary[500];
    }
  };

  const getRoute = (type: string) => {
    switch (type) {
      case 'assignments': return '/assignments';
      case 'notes': return '/notes';
      case 'flashcards': return '/flashcards';
      case 'quizzes': return '/quiz';
      default: return '/';
    }
  };

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Study Hub</Text>
        <View style={[styles.searchContainer, { backgroundColor: cardBg }]}>
          <Search size={18} color={textMuted} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            placeholder="Search assignments, notes, flashcards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {searchCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100] }, activeCategory === cat.id && { backgroundColor: Colors.primary[500] }]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text style={[styles.categoryText, { color: isDark ? DarkColors.textSecondary : Colors.neutral[600] }, activeCategory === cat.id && { color: '#FFFFFF' }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.toolsSection}>
          <Text style={[styles.toolsTitle, { color: textPrimary }]}>Study Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/tutor')}>
              <LinearGradient colors={Gradients.primary} style={styles.toolIconBg}><BookOpen size={24} color="#FFFFFF" /></LinearGradient>
              <Text style={[styles.toolLabel, { color: textSecondary }]}>AI Tutor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/quiz')}>
              <LinearGradient colors={Gradients.accent} style={styles.toolIconBg}><HelpCircle size={24} color="#FFFFFF" /></LinearGradient>
              <Text style={[styles.toolLabel, { color: textSecondary }]}>Quizzes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/flashcards')}>
              <LinearGradient colors={Gradients.success} style={styles.toolIconBg}><Layers size={24} color="#FFFFFF" /></LinearGradient>
              <Text style={[styles.toolLabel, { color: textSecondary }]}>Flashcards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/notes')}>
              <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.toolIconBg}><Scissors size={24} color="#FFFFFF" /></LinearGradient>
              <Text style={[styles.toolLabel, { color: textSecondary }]}>Notes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsSection}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            {searchQuery ? `Results (${filtered.length})` : 'Recent Items'}
          </Text>
          {filtered.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <Animated.View key={`${item.type}-${item.id}`} entering={FadeInUp.delay(index * 50).duration(300)}>
                <TouchableOpacity style={[styles.resultCard, { backgroundColor: cardBg }]} onPress={() => router.push(getRoute(item.type) as any)}>
                  <View style={[styles.resultIconBg, { backgroundColor: getColor(item.type) + '15' }]}>
                    <Icon size={18} color={getColor(item.type)} />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultTitle, { color: textPrimary }]}>{item.displayTitle}</Text>
                    <Text style={[styles.resultSubtitle, { color: textSecondary }]}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={16} color={textMuted} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Search size={40} color={textMuted} />
              <Text style={[styles.emptyText, { color: textMuted }]}>No results found</Text>
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, gap: Spacing.sm },
  searchInput: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 14 },
  categoryRow: { paddingTop: Spacing.md, gap: Spacing.sm },
  categoryChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  categoryText: { fontFamily: 'Inter-Medium', fontSize: 13 },
  toolsSection: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'] },
  toolsTitle: { fontFamily: 'Inter-Bold', fontSize: 18, marginBottom: Spacing.lg },
  toolsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  toolCard: { alignItems: 'center', gap: Spacing.sm },
  toolIconBg: { width: 56, height: 56, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  toolLabel: { fontFamily: 'Inter-Medium', fontSize: 12 },
  resultsSection: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'] },
  sectionTitle: { fontFamily: 'Inter-Bold', fontSize: 18, marginBottom: Spacing.lg },
  resultCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, gap: Spacing.md },
  resultIconBg: { width: 40, height: 40, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  resultInfo: { flex: 1 },
  resultTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  resultSubtitle: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyText: { fontFamily: 'Inter-Regular', fontSize: 14, marginTop: Spacing.md },
});
