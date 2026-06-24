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
  Plus,
  Sparkles,
  Copy,
  Check,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';
import { sampleNotes } from '@/constants/data';

interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  date: string;
  simplified: boolean;
}

export default function NotesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', subject: '' });
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleAdd = () => {
    if (!formData.title || !formData.content) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      subject: formData.subject || 'General',
      date: new Date().toISOString().split('T')[0],
      simplified: false,
    };
    setNotes([newNote, ...notes]);
    setFormData({ title: '', content: '', subject: '' });
    setShowForm(false);
  };

  const simplifyNote = (id: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              simplified: true,
              content: n.simplified
                ? n.content
                : generateSimplified(n.content),
            }
          : n
      )
    );
  };

  const generateSimplified = (content: string) => {
    return `**Summary:**\n${content.slice(0, 100)}...\n\n**Key Concepts:**\n• Core idea extracted from the text\n• Important relationship between concepts\n• Practical application points\n\n**Definitions:**\n• Key term: Brief explanation\n• Another term: Brief explanation\n\n**Revision Points:**\n1. First important point to remember\n2. Second critical concept\n3. Third key takeaway\n\n**Bullet Notes:**\n- Simplified fact 1\n- Simplified fact 2\n- Simplified fact 3`;
  };

  const handleCopy = (text: string) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentNote = notes.find((n) => n.id === selectedNote);

  if (currentNote) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.detailHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setSelectedNote(null)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]} numberOfLines={1}>
            {currentNote.title}
          </Text>
          <TouchableOpacity onPress={() => handleCopy(currentNote.content)}>
            {copied ? (
              <Check size={20} color={Colors.success[500]} />
            ) : (
              <Copy size={20} color={textMuted} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <View style={styles.detailMeta}>
            <Text style={[styles.detailSubject, { color: Colors.primary[500], backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>{currentNote.subject}</Text>
            <Text style={[styles.detailDate, { color: textSecondary }]}>{currentNote.date}</Text>
          </View>

          {!currentNote.simplified && (
            <TouchableOpacity
              style={styles.simplifyButton}
              onPress={() => simplifyNote(currentNote.id)}
            >
              <LinearGradient colors={Gradients.primary} style={styles.simplifyGradient}>
                <Sparkles size={18} color="#FFFFFF" />
                <Text style={styles.simplifyText}>Simplify with AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {currentNote.simplified && (
            <View style={[styles.simplifiedBadge, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>
              <Sparkles size={14} color={Colors.primary[500]} />
              <Text style={[styles.simplifiedBadgeText, { color: Colors.primary[600] }]}>AI Simplified</Text>
            </View>
          )}

          <View style={[styles.noteContentCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.noteContentText, { color: textSecondary }]}>{currentNote.content}</Text>
          </View>

          {currentNote.simplified && (
            <View style={[styles.outputCard, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50], borderColor: isDark ? DarkColors.border : Colors.primary[200] }]}>
              <Text style={[styles.outputTitle, { color: isDark ? DarkColors.primary : Colors.primary[700] }]}>AI Output</Text>
              <View style={styles.outputSection}>
                <Text style={[styles.outputSectionTitle, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Summary</Text>
                <Text style={[styles.outputText, { color: textSecondary }]}>
                  Condensed version of the main ideas and arguments presented in the notes.
                </Text>
              </View>
              <View style={styles.outputSection}>
                <Text style={[styles.outputSectionTitle, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Key Concepts</Text>
                <View style={styles.outputList}>
                  {['Core principle', 'Supporting theory', 'Practical application'].map(
                    (item, i) => (
                      <View key={i} style={styles.outputListItem}>
                        <View style={[styles.outputBullet, { backgroundColor: isDark ? DarkColors.primary : Colors.primary[500] }]} />
                        <Text style={[styles.outputText, { color: textSecondary }]}>{item}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
              <View style={styles.outputSection}>
                <Text style={[styles.outputSectionTitle, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Definitions</Text>
                <View style={styles.outputList}>
                  {['Term A: Definition here', 'Term B: Definition here'].map((item, i) => (
                    <View key={i} style={styles.outputListItem}>
                      <View style={[styles.outputBullet, { backgroundColor: isDark ? DarkColors.primary : Colors.primary[500] }]} />
                      <Text style={[styles.outputText, { color: textSecondary }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.outputSection}>
                <Text style={[styles.outputSectionTitle, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Revision Points</Text>
                <View style={styles.outputList}>
                  {['Remember this key fact', 'Understand this relationship', 'Apply this concept'].map(
                    (item, i) => (
                      <View key={i} style={styles.outputListItem}>
                        <Text style={[styles.outputNumber, { color: isDark ? DarkColors.primary : Colors.primary[500] }]}>{i + 1}.</Text>
                        <Text style={[styles.outputText, { color: textSecondary }]}>{item}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
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
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Notes Simplifier</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>Add Notes</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Note title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Subject"
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Paste your notes here..."
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              multiline
              numberOfLines={5}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Save Notes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Notes</Text>

        {notes.map((note, index) => (
          <Animated.View key={note.id} entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
              style={[styles.noteCard, { backgroundColor: cardBg }]}
              onPress={() => setSelectedNote(note.id)}
            >
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEF3C7', '#FDE68A']} style={styles.noteIconBg}>
                <FileText size={24} color={isDark ? DarkColors.warning : Colors.warning[600]} />
              </LinearGradient>
              <View style={styles.noteInfo}>
                <Text style={[styles.noteTitle, { color: textPrimary }]}>{note.title}</Text>
                <Text style={[styles.noteMeta, { color: textSecondary }]}>
                  {note.subject} • {note.date}
                </Text>
                <Text style={[styles.notePreview, { color: textMuted }]} numberOfLines={2}>
                  {note.content.slice(0, 80)}...
                </Text>
              </View>
              {note.simplified && (
                <View style={[styles.simplifiedChip, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>
                  <Sparkles size={12} color={Colors.primary[500]} />
                  <Text style={[styles.simplifiedChipText, { color: Colors.primary[600] }]}>AI</Text>
                </View>
              )}
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
  textArea: {
    height: 120,
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
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  noteIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  noteMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  notePreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  simplifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  simplifiedChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  detailTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    flex: 1,
    marginHorizontal: Spacing.md,
    textAlign: 'center',
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  detailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  detailSubject: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  detailDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  simplifyButton: {
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  simplifyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  simplifyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  simplifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  simplifiedBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  noteContentCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    marginBottom: Spacing.lg,
  },
  noteContentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  outputCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  outputTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.lg,
  },
  outputSection: {
    marginBottom: Spacing.lg,
  },
  outputSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  outputText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  outputList: {
    gap: Spacing.xs,
  },
  outputListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  outputBullet: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    marginTop: 6,
  },
  outputNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    minWidth: 16,
  },
});
