import { useState } from 'react';
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
  ArrowLeft,
  Monitor,
  Plus,
  ChevronRight,
  Mic,
  Lightbulb,
  MessageSquare,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';

interface Slide {
  id: string;
  title: string;
  bullets: string[];
  speakerNotes: string;
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
        {
          id: 's1',
          title: 'Introduction',
          bullets: ['What are data structures?', 'Why do they matter?', 'Common types overview'],
          speakerNotes: 'Welcome the audience and set expectations for the presentation.',
        },
        {
          id: 's2',
          title: 'Arrays and Linked Lists',
          bullets: ['Arrays: contiguous memory, O(1) access', 'Linked Lists: dynamic size, O(n) access', 'Trade-offs and use cases'],
          speakerNotes: 'Emphasize memory layout differences and performance implications.',
        },
        {
          id: 's3',
          title: 'Trees and Graphs',
          bullets: ['Binary Search Trees: O(log n) operations', 'Graphs: adjacency list vs matrix', 'Real-world applications'],
          speakerNotes: 'Discuss practical use cases like file systems, routing, and social networks.',
        },
      ],
    },
  ]);
  const [selectedPresentation, setSelectedPresentation] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleGenerate = () => {
    if (!topic) return;
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      topic,
      slides: [
        {
          id: '1',
          title: 'Introduction',
          bullets: [`Overview of ${topic}`, 'Key concepts and definitions', 'Presentation outline'],
          speakerNotes: `Introduce the topic of ${topic} and outline what will be covered.`,
        },
        {
          id: '2',
          title: 'Main Concepts',
          bullets: ['Core principles and frameworks', 'Current industry practices', 'Case study examples'],
          speakerNotes: 'Walk through the fundamental concepts with real-world examples.',
        },
        {
          id: '3',
          title: 'Applications',
          bullets: ['Practical implementation steps', 'Tools and resources', 'Best practices'],
          speakerNotes: 'Show how to apply these concepts in practical scenarios.',
        },
        {
          id: '4',
          title: 'Conclusion',
          bullets: ['Key takeaways', 'Future outlook', 'Call to action'],
          speakerNotes: 'Summarize the main points and encourage further exploration.',
        },
      ],
    };
    setPresentations([newPresentation, ...presentations]);
    setTopic('');
    setShowForm(false);
    setSelectedPresentation(newPresentation.id);
    setActiveSlide(0);
  };

  const currentPresentation = presentations.find((p) => p.id === selectedPresentation);

  if (currentPresentation) {
    const slide = currentPresentation.slides[activeSlide];
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.slideHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setSelectedPresentation(null)} style={styles.backButton}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.slideHeaderTitle, { color: textPrimary }]} numberOfLines={1}>
            {currentPresentation.topic}
          </Text>
          <Text style={[styles.slideCounter, { color: Colors.primary[500] }]}>
            {activeSlide + 1} / {currentPresentation.slides.length}
          </Text>
        </View>

        <ScrollView style={styles.slideContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.slideCard, { backgroundColor: cardBg }]}>
            <LinearGradient colors={Gradients.primary} style={styles.slideGradient}>
              <Text style={styles.slideNumber}>Slide {activeSlide + 1}</Text>
              <Text style={styles.slideTitle}>{slide.title}</Text>
            </LinearGradient>
            <View style={styles.slideBody}>
              {slide.bullets.map((bullet, i) => (
                <View key={i} style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={[styles.bulletText, { color: textSecondary }]}>{bullet}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <View style={[styles.notesCard, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>
            <View style={styles.notesHeader}>
              <Mic size={18} color={Colors.primary[500]} />
              <Text style={[styles.notesTitle, { color: isDark ? DarkColors.primary : Colors.primary[700] }]}>Speaker Notes</Text>
            </View>
            <Text style={[styles.notesText, { color: textSecondary }]}>{slide.speakerNotes}</Text>
          </View>

          <View style={[styles.qaCard, { backgroundColor: isDark ? DarkColors.surface : Colors.secondary[50] }]}>
            <View style={styles.qaHeader}>
              <MessageSquare size={18} color={Colors.secondary[500]} />
              <Text style={[styles.qaTitle, { color: isDark ? DarkColors.accent : Colors.secondary[700] }]}>Q&A Suggestions</Text>
            </View>
            <View style={styles.qaItem}>
              <Lightbulb size={14} color={Colors.warning[500]} />
              <Text style={[styles.qaText, { color: textSecondary }]}>What are the main challenges in this area?</Text>
            </View>
            <View style={styles.qaItem}>
              <Lightbulb size={14} color={Colors.warning[500]} />
              <Text style={[styles.qaText, { color: textSecondary }]}>How does this compare to previous approaches?</Text>
            </View>
          </View>

          <View style={[styles.tipsCard, { backgroundColor: isDark ? DarkColors.surface : Colors.warning[50], borderColor: isDark ? DarkColors.border : Colors.warning[200] }]}>
            <Text style={[styles.tipsTitle, { color: isDark ? DarkColors.warning : Colors.warning[700] }]}>Presentation Tips</Text>
            <Text style={[styles.tipsText, { color: textSecondary }]}>
              - Maintain eye contact with your audience{'\n'}- Use gestures to emphasize key points{'\n'}- Pause after important statements{'\n'}- Keep slides visually clean
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <View style={[styles.slideNavigation, { backgroundColor: cardBg, borderTopColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity
            style={[styles.navButton, activeSlide === 0 && styles.navButtonDisabled]}
            onPress={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <View style={styles.navDots}>
            {currentPresentation.slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.navDot, i === activeSlide && styles.navDotActive]}
                onPress={() => setActiveSlide(i)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.navButton,
              activeSlide === currentPresentation.slides.length - 1 && styles.navButtonDisabled,
            ]}
            onPress={() =>
              setActiveSlide(Math.min(currentPresentation.slides.length - 1, activeSlide + 1))
            }
            disabled={activeSlide === currentPresentation.slides.length - 1}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Presentation Builder</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addButton}>
            <LinearGradient colors={Gradients.primary} style={styles.addButtonGradient}>
              <Plus size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showForm && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.formTitle, { color: textPrimary }]}>Create Presentation</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Enter presentation topic"
              value={topic}
              onChangeText={setTopic}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleGenerate}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Generate Slides</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Presentations</Text>

        {presentations.map((presentation, index) => (
          <Animated.View key={presentation.id} entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
              style={[styles.presentationCard, { backgroundColor: cardBg }]}
              onPress={() => {
                setSelectedPresentation(presentation.id);
                setActiveSlide(0);
              }}
            >
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.presentationIconBg}>
                <Monitor size={28} color={Colors.primary[500]} />
              </LinearGradient>
              <View style={styles.presentationInfo}>
                <Text style={[styles.presentationTitle, { color: textPrimary }]}>{presentation.topic}</Text>
                <Text style={[styles.presentationMeta, { color: textSecondary }]}>
                  {presentation.slides.length} slides
                </Text>
              </View>
              <ChevronRight size={20} color={textMuted} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={{ height: 40 }} />
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  addButton: {
    ...Shadows.sm,
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
  },
  formCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  formTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
  submitGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  presentationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  presentationIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presentationInfo: {
    flex: 1,
  },
  presentationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  presentationMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  slideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  slideHeaderTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    flex: 1,
    marginHorizontal: Spacing.md,
    textAlign: 'center',
  },
  slideCounter: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  slideCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  slideGradient: {
    padding: Spacing['2xl'],
  },
  slideNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  slideTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  slideBody: {
    padding: Spacing['2xl'],
    gap: Spacing.md,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    marginTop: 6,
  },
  bulletText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  notesCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  notesTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  notesText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  qaCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  qaTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  qaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  qaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  tipsCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  tipsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  tipsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 22,
  },
  slideNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
  },
  navButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[500],
  },
  navButtonDisabled: {
    backgroundColor: Colors.neutral[200],
  },
  navButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  navDots: {
    flexDirection: 'row',
    gap: 6,
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[300],
  },
  navDotActive: {
    backgroundColor: Colors.primary[500],
    width: 20,
  },
});
