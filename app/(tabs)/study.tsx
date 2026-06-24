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
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  Scissors,
  Mic,
  Camera,
  Upload,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';
import { sampleAssignments, sampleFlashcards, sampleNotes, sampleQuizzes } from '@/constants/data';

const searchCategories = [
  { id: 'all', label: 'All' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'notes', label: 'Notes' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quizzes', label: 'Quizzes' },
];

export default function StudyTabScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const allItems = [
    ...sampleAssignments.map((a) => ({ ...a, type: 'assignments' as const, subtitle: a.subject, displayTitle: a.title })),
    ...sampleNotes.map((n) => ({ ...n, type: 'notes' as const, subtitle: n.subject, displayTitle: n.title })),
    ...sampleFlashcards.map((f) => ({ ...f, type: 'flashcards' as const, subtitle: f.subject, displayTitle: f.front })),
    ...sampleQuizzes.map((q) => ({ ...q, type: 'quizzes' as const, subtitle: q.subject, displayTitle: q.title })),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
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

  const getGradient = (type: string): readonly [string, string] => {
    switch (type) {
      case 'assignments': return ['#EEF2FF', '#E0E7FF'] as const;
      case 'notes': return ['#FEF3C7', '#FDE68A'] as const;
      case 'flashcards': return ['#F0FDF4', '#DCFCE7'] as const;
      case 'quizzes': return ['#FEE2E2', '#FECACA'] as const;
      default: return ['#EEF2FF', '#E0E7FF'] as const;
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {searchCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100] },
                activeCategory === cat.id && { backgroundColor: Colors.primary[500] },
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: isDark ? DarkColors.textSecondary : Colors.neutral[600] },
                  activeCategory === cat.id && { color: '#FFFFFF' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!searchQuery && (
          <View style={styles.toolsSection}>
            <Text style={[styles.toolsTitle, { color: textPrimary }]}>Study Tools</Text>
            <View style={styles.toolsGrid}>
              <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/tutor')}>
                <LinearGradient colors={Gradients.primary} style={styles.toolIconBg}>
                  <BookOpen size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.toolLabel, { color: textSecondary }]}>AI Tutor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/quiz')}>
                <LinearGradient colors={Gradients.accent} style={styles.toolIconBg}>
                  <HelpCircle size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.toolLabel, { color: textSecondary }]}>Quizzes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/flashcards')}>
                <LinearGradient colors={Gradients.success} style={styles.toolIconBg}>
                  <Layers size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.toolLabel, { color: textSecondary }]}>Flashcards</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolCard} onPress={() => router.push('/notes')}>
                <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.toolIconBg}>
                  <Scissors size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={[styles.toolLabel, { color: textSecondary }]}>Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.uploadSection}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Upload & Scan</Text>
          <View style={styles.uploadGrid}>
            <TouchableOpacity style={[styles.uploadCard, { backgroundColor: cardBg }]} onPress={() => setShowUpload(!showUpload)}>
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.uploadIconBg}>
                <Upload size={24} color={Colors.primary[500]} />
              </LinearGradient>
              <Text style={[styles.uploadLabel, { color: textPrimary }]}>Documents</Text>
              <Text style={[styles.uploadSubtext, { color: textSecondary }]}>PDF, DOCX, PPT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadCard, { backgroundColor: cardBg }]} onPress={() => setShowScan(!showScan)}>
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#F0FDFA', '#CCFBF1']} style={styles.uploadIconBg}>
                <Camera size={24} color={Colors.secondary[500]} />
              </LinearGradient>
              <Text style={[styles.uploadLabel, { color: textPrimary }]}>OCR Scan</Text>
              <Text style={[styles.uploadSubtext, { color: textSecondary }]}>Handwritten notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.uploadCard, { backgroundColor: cardBg }]} onPress={() => setShowVoice(!showVoice)}>
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEF2F2', '#FEE2E2']} style={styles.uploadIconBg}>
                <Mic size={24} color={Colors.error[500]} />
              </LinearGradient>
              <Text style={[styles.uploadLabel, { color: textPrimary }]}>Voice</Text>
              <Text style={[styles.uploadSubtext, { color: textSecondary }]}>Dictation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showUpload && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.uploadPanel, { backgroundColor: cardBg }]}>
            <Text style={[styles.panelTitle, { color: textPrimary }]}>Upload Documents</Text>
            <View style={styles.fileTypes}>
              {['PDF', 'DOCX', 'PPTX', 'Images'].map((type) => (
                <TouchableOpacity key={type} style={[styles.fileTypeButton, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100] }]}>
                  <Text style={[styles.fileTypeText, { color: textSecondary }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.uploadArea, { borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}>
              <Upload size={32} color={textMuted} />
              <Text style={[styles.uploadAreaText, { color: textSecondary }]}>Tap to browse files</Text>
              <Text style={[styles.uploadAreaSubtext, { color: textMuted }]}>Files stored locally</Text>
            </View>
          </Animated.View>
        )}

        {showScan && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.uploadPanel, { backgroundColor: cardBg }]}>
            <Text style={[styles.panelTitle, { color: textPrimary }]}>OCR Image Scanner</Text>
            <View style={[styles.scanArea, { borderColor: isDark ? DarkColors.border : Colors.secondary[300] }]}>
              <Camera size={32} color={textMuted} />
              <Text style={[styles.uploadAreaText, { color: textSecondary }]}>Tap to scan document</Text>
              <Text style={[styles.uploadAreaSubtext, { color: textMuted }]}>Capture textbook pages or notes</Text>
            </View>
            <View style={[styles.scanPreview, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100] }]}>
              <Text style={[styles.scanPreviewText, { color: textMuted }]}>Processing...</Text>
              <View style={[styles.scanBar, { backgroundColor: isDark ? DarkColors.border : Colors.neutral[200] }]}>
                <View style={styles.scanBarFill} />
              </View>
            </View>
          </Animated.View>
        )}

        {showVoice && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.uploadPanel, { backgroundColor: cardBg }]}>
            <Text style={[styles.panelTitle, { color: textPrimary }]}>Voice Study Assistant</Text>
            <TouchableOpacity style={styles.voiceButton} onPress={() => setIsRecording(!isRecording)}>
              <LinearGradient colors={isRecording ? Gradients.error : Gradients.primary} style={styles.voiceButtonGradient}>
                <Mic size={32} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={[styles.voiceStatus, { color: textSecondary }]}>
              {isRecording ? 'Listening...' : 'Tap to start dictation'}
            </Text>
            {isRecording && (
              <View style={styles.voiceWaveform}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={i} style={[styles.waveformBar, { backgroundColor: Colors.primary[500], height: 8 + Math.random() * 24, opacity: 0.3 + Math.random() * 0.7 }]} />
                ))}
              </View>
            )}
          </Animated.View>
        )}

        <View style={styles.resultsSection}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            {searchQuery ? `Results (${filteredItems.length})` : 'Recent Items'}
          </Text>
          {filteredItems.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <Animated.View key={`${item.type}-${item.id}`} entering={FadeInUp.delay(index * 50).duration(300)}>
                <TouchableOpacity style={[styles.resultCard, { backgroundColor: cardBg }]}>
                  <LinearGradient colors={getGradient(item.type)} style={styles.resultIconBg}>
                    <Icon size={20} color={getColor(item.type)} />
                  </LinearGradient>
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultTitle, { color: textPrimary }]}>{item.displayTitle}</Text>
                    <Text style={[styles.resultSubtitle, { color: textSecondary }]}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={16} color={textMuted} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          {filteredItems.length === 0 && (
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  categoryRow: {
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  toolsSection: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  toolsTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toolCard: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toolIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  toolLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  uploadSection: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  uploadCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  uploadIconBg: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  uploadLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  uploadSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  uploadPanel: {
    marginHorizontal: Spacing['2xl'],
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  panelTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    marginBottom: Spacing.md,
  },
  fileTypes: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  fileTypeButton: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  fileTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  uploadAreaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: Spacing.md,
  },
  uploadAreaSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  scanArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  scanPreview: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  scanPreviewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  scanBar: {
    height: 4,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  scanBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: Colors.secondary[500],
  },
  voiceButton: {
    alignSelf: 'center',
    marginVertical: Spacing.lg,
  },
  voiceButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  voiceStatus: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginTop: Spacing.lg,
    height: 40,
  },
  waveformBar: {
    width: 4,
    borderRadius: BorderRadius.full,
  },
  resultsSection: {
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing['2xl'],
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: Spacing.md,
  },
  resultIconBg: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  resultSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
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
});
