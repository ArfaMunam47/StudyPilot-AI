import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Monitor, Plus, ChevronRight, X, Lightbulb } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

interface Slide {
  id: string;
  title: string;
  bullets: string[];
}

interface Presentation {
  id: string;
  topic: string;
  slides: Slide[];
}

export default function PresentationsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState('');
  const [presentations, setPresentations] = useState<Presentation[]>([
    {
      id: '1',
      topic: 'Introduction to Data Structures',
      slides: [
        { id: 's1', title: 'Introduction', bullets: ['What are data structures?', 'Why do they matter?', 'Common types overview'] },
        { id: 's2', title: 'Arrays and Linked Lists', bullets: ['Arrays: contiguous memory, O(1) access', 'Linked Lists: dynamic size, O(n) access', 'Trade-offs and use cases'] },
        { id: 's3', title: 'Trees and Graphs', bullets: ['Binary Search Trees: O(log n) operations', 'Graphs: adjacency list vs matrix', 'Real-world applications'] },
      ],
    },
  ]);
  const [selected, setSelected] = useState<string | null>(null);

  function handleGenerate() {
    if (!topic) return;
    const newPres: Presentation = {
      id: Date.now().toString(),
      topic,
      slides: [
        { id: '1', title: 'Introduction', bullets: [`Overview of ${topic}`, 'Key concepts and definitions', 'Learning objectives'] },
        { id: '2', title: 'Core Concepts', bullets: ['Fundamental principles', 'Important techniques', 'Best practices'] },
        { id: '3', title: 'Applications', bullets: ['Real-world use cases', 'Industry examples', 'Future trends'] },
        { id: '4', title: 'Summary', bullets: ['Key takeaways', 'Next steps', 'Further reading'] },
      ],
    };
    setPresentations([newPres, ...presentations]);
    setTopic('');
    setShowForm(false);
  }

  const current = presentations.find((p) => p.id === selected);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  if (current) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textPrimary }]} numberOfLines={1}>{current.topic}</Text>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>
        <ScrollView showsVerticalScrollIndicator={false}>
          {current.slides.map((slide, i) => (
            <Animated.View key={slide.id} entering={FadeInUp.delay(i * 100).duration(400)}>
              <View style={[styles.slideCard, { backgroundColor: cardBg }]}>
                <View style={styles.slideNumber}><Text style={styles.slideNumberText}>{i + 1}</Text></View>
                <Text style={[styles.slideTitle, { color: textPrimary }]}>{slide.title}</Text>
                {slide.bullets.map((b, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: Colors.primary[500] }]} />
                    <Text style={[styles.bulletText, { color: textSecondary }]}>{b}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Presentations</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addBtn}>
            <LinearGradient colors={Gradients.primary} style={styles.addGradient}>
              {showForm ? <X size={18} color="#FFFFFF" /> : <Plus size={18} color="#FFFFFF" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showForm && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.formTitle, { color: textPrimary }]}>Generate Presentation</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Topic (e.g., Machine Learning)" placeholderTextColor={textMuted} value={topic} onChangeText={setTopic} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleGenerate}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Lightbulb size={18} color="#FFFFFF" />
                <Text style={styles.submitText}>Generate</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {presentations.map((p, i) => (
          <Animated.View key={p.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <TouchableOpacity style={[styles.presCard, { backgroundColor: cardBg }]} onPress={() => setSelected(p.id)}>
              <LinearGradient colors={Gradients.secondary} style={styles.presIcon}>
                <Monitor size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.presInfo}>
                <Text style={[styles.presTitle, { color: textPrimary }]}>{p.topic}</Text>
                <Text style={[styles.presSlides, { color: textSecondary }]}>{p.slides.length} slides</Text>
              </View>
              <ChevronRight size={20} color={textMuted} />
            </TouchableOpacity>
          </Animated.View>
        ))}
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
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, gap: Spacing.sm },
  submitText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#FFFFFF' },
  presCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  presIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  presInfo: { flex: 1 },
  presTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  presSlides: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  slideCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  slideNumber: { width: 32, height: 32, borderRadius: BorderRadius.full, backgroundColor: Colors.primary[500], justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  slideNumberText: { fontFamily: 'Inter-Bold', fontSize: 14, color: '#FFFFFF' },
  slideTitle: { fontFamily: 'Inter-Bold', fontSize: 16, marginBottom: Spacing.md },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  bulletDot: { width: 6, height: 6, borderRadius: BorderRadius.full, marginTop: 6 },
  bulletText: { fontFamily: 'Inter-Regular', fontSize: 14, flex: 1, lineHeight: 20 },
});
