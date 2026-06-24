import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  RotateCw,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';
import { sampleFlashcards } from '@/constants/data';

const { width } = Dimensions.get('window');

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  mastered: boolean;
}

export default function FlashcardsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ front: '', back: '', subject: '' });
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const rotateY = useSharedValue(0);

  const handleAdd = () => {
    if (!formData.front || !formData.back) return;
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: formData.front,
      back: formData.back,
      subject: formData.subject || 'General',
      mastered: false,
    };
    setFlashcards([newCard, ...flashcards]);
    setFormData({ front: '', back: '', subject: '' });
    setShowForm(false);
  };

  const toggleMastered = (id: string) => {
    setFlashcards(
      flashcards.map((c) => (c.id === id ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const handleFlip = () => {
    rotateY.value = withSpring(rotateY.value === 0 ? 180 : 0, {
      damping: 15,
      stiffness: 100,
    });
    setFlipped(!flipped);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(rotateY.value, [0, 180], [0, 180])}deg` },
      { perspective: 1000 },
    ],
    opacity: interpolate(rotateY.value, [0, 90, 180], [1, 0, 0]),
    backfaceVisibility: 'hidden' as const,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(rotateY.value, [0, 180], [180, 360])}deg` },
      { perspective: 1000 },
    ],
    opacity: interpolate(rotateY.value, [0, 90, 180], [0, 0, 1]),
    backfaceVisibility: 'hidden' as const,
  }));

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      rotateY.value = 0;
      setFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      rotateY.value = 0;
      setFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (studyMode && flashcards.length > 0) {
    const card = flashcards[currentIndex];
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.studyHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setStudyMode(false)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.studyTitle, { color: textPrimary }]}>
            {currentIndex + 1} / {flashcards.length}
          </Text>
          <TouchableOpacity onPress={() => toggleMastered(card.id)}>
            <Check
              size={24}
              color={card.mastered ? Colors.success[500] : textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.studyContent}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={styles.cardContainer}>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
              <LinearGradient colors={Gradients.primary} style={styles.cardGradient}>
                <Text style={styles.cardSubject}>{card.subject}</Text>
                <Text style={styles.cardText}>{card.front}</Text>
                <Text style={styles.cardHint}>Tap to flip</Text>
              </LinearGradient>
            </Animated.View>
            <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
              <LinearGradient colors={Gradients.secondary} style={styles.cardGradient}>
                <Text style={styles.cardSubject}>{card.subject}</Text>
                <Text style={styles.cardText}>{card.back}</Text>
                <Text style={styles.cardHint}>Tap to flip back</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={[styles.studyNav, { backgroundColor: cardBg, borderTopColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && [styles.navButtonDisabled, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[50] }]]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={24} color={currentIndex === 0 ? textMuted : textSecondary} />
          </TouchableOpacity>

          <View style={styles.navDots}>
            {flashcards.map((_, i) => (
              <View
                key={i}
                style={[styles.navDot, i === currentIndex && styles.navDotActive]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === flashcards.length - 1 && [styles.navButtonDisabled, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[50] }],
            ]}
            onPress={handleNext}
            disabled={currentIndex === flashcards.length - 1}
          >
            <ChevronRight
              size={24}
              color={
                currentIndex === flashcards.length - 1
                  ? textMuted
                  : textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: cardBg }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Flashcards</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>New Flashcard</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Front (question or term)"
              value={formData.front}
              onChangeText={(text) => setFormData({ ...formData, front: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Back (answer or definition)"
              value={formData.back}
              onChangeText={(text) => setFormData({ ...formData, back: text })}
              multiline
              numberOfLines={3}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Subject"
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Create Flashcard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {flashcards.length > 0 && (
          <TouchableOpacity
            style={styles.studyButton}
            onPress={() => {
              setCurrentIndex(0);
              setFlipped(false);
              rotateY.value = 0;
              setStudyMode(true);
            }}
          >
            <LinearGradient colors={Gradients.primary} style={styles.studyGradient}>
              <RotateCw size={20} color="#FFFFFF" />
              <Text style={styles.studyButtonText}>Start Study Session</Text>
              <Text style={styles.studyButtonSubtext}>
                {flashcards.filter((c) => !c.mastered).length} cards remaining
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Flashcards</Text>

        {flashcards.map((card, index) => (
          <Animated.View key={card.id} entering={FadeInUp.delay(index * 100).duration(400)}>
            <View style={[styles.flashcardItem, { backgroundColor: cardBg }]}>
              <View style={styles.flashcardContent}>
                <Text style={[styles.flashcardFront, { color: textPrimary }]}>{card.front}</Text>
                <Text style={[styles.flashcardBack, { color: textSecondary }]}>{card.back}</Text>
                <View style={styles.flashcardMeta}>
                  <Text style={[styles.flashcardSubject, { color: Colors.primary[500], backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>{card.subject}</Text>
                  {card.mastered && (
                    <View style={[styles.masteredBadge, { backgroundColor: isDark ? DarkColors.surface : Colors.success[50] }]}>
                      <Check size={12} color={Colors.success[500]} />
                      <Text style={[styles.masteredText, { color: Colors.success[600] }]}>Mastered</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.masterButton}
                onPress={() => toggleMastered(card.id)}
              >
                <Check
                  size={20}
                  color={card.mastered ? Colors.success[500] : Colors.neutral[300]}
                />
              </TouchableOpacity>
            </View>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  studyButton: {
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  studyGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  studyButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  studyButtonSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  flashcardItem: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  flashcardContent: {
    flex: 1,
  },
  flashcardFront: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginBottom: Spacing.xs,
  },
  flashcardBack: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  flashcardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  flashcardSubject: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  masteredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  masteredText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
  },
  masterButton: {
    justifyContent: 'center',
    paddingLeft: Spacing.md,
  },
  studyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  studyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  studyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  cardContainer: {
    width: width - Spacing['2xl'] * 2,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius['3xl'],
    overflow: 'hidden',
    ...Shadows.xl,
  },
  cardBack: {
    backfaceVisibility: 'hidden',
  },
  cardGradient: {
    flex: 1,
    padding: Spacing['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSubject: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
  },
  cardHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: Spacing['2xl'],
  },
  studyNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: Colors.neutral[50],
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
