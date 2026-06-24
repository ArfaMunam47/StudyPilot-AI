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
  FileText,
  Plus,
  CheckCircle,
  Circle,
  Clock,
  Tag,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';
import { sampleAssignments } from '@/constants/data';

export default function AssignmentsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [assignments, setAssignments] = useState(sampleAssignments);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    instructions: '',
    dueDate: '',
  });
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleAdd = () => {
    if (!formData.title || !formData.subject) return;
    const newAssignment = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      dueDate: formData.dueDate || '2026-06-30',
      status: 'pending',
      priority: 'medium',
    };
    setAssignments([newAssignment, ...assignments]);
    setFormData({ title: '', subject: '', instructions: '', dueDate: '' });
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    setAssignments(
      assignments.map((a) =>
        a.id === id ? { ...a, status: a.status === 'completed' ? 'pending' : 'completed' } : a
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.error[500];
      case 'medium': return Colors.warning[500];
      default: return Colors.success[500];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: cardBg }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Assignment Assistant</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>New Assignment</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Assignment title"
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
              placeholder="Instructions / Notes"
              value={formData.instructions}
              onChangeText={(text) => setFormData({ ...formData, instructions: text })}
              multiline
              numberOfLines={3}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Due date (YYYY-MM-DD)"
              value={formData.dueDate}
              onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Create Assignment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.aiHelpCard}>
          <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.aiHelpGradient}>
            <FileText size={32} color={Colors.primary[500]} />
            <Text style={[styles.aiHelpTitle, { color: isDark ? DarkColors.primary : Colors.primary[700] }]}>AI Assignment Help</Text>
            <Text style={[styles.aiHelpDesc, { color: isDark ? DarkColors.textSecondary : Colors.primary[600] }]}>
              Get outlines, research points, structure ideas, and submission checklists
            </Text>
          </LinearGradient>
        </View>

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Your Assignments</Text>

        {assignments.map((assignment, index) => (
          <Animated.View key={assignment.id} entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
              style={[styles.assignmentCard, { backgroundColor: cardBg }]}
              onPress={() => setSelectedAssignment(selectedAssignment === assignment.id ? null : assignment.id)}
            >
              <View style={styles.assignmentHeader}>
                <TouchableOpacity onPress={() => toggleStatus(assignment.id)}>
                  {assignment.status === 'completed' ? (
                    <CheckCircle size={24} color={Colors.success[500]} />
                  ) : (
                    <Circle size={24} color={textMuted} />
                  )}
                </TouchableOpacity>
                <View style={styles.assignmentInfo}>
                  <Text
                    style={[
                      styles.assignmentTitle,
                      { color: textPrimary },
                      assignment.status === 'completed' && [styles.completedTitle, { color: textMuted }],
                    ]}
                  >
                    {assignment.title}
                  </Text>
                  <View style={styles.assignmentMeta}>
                    <Tag size={14} color={textMuted} />
                    <Text style={[styles.metaText, { color: textSecondary }]}>{assignment.subject}</Text>
                    <Clock size={14} color={textMuted} />
                    <Text style={[styles.metaText, { color: textSecondary }]}>{assignment.dueDate}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(assignment.priority) + '20' },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: getPriorityColor(assignment.priority) }]}>
                    {assignment.priority}
                  </Text>
                </View>
                <ChevronRight
                  size={16}
                  color={textMuted}
                  style={{
                    transform: [{ rotate: selectedAssignment === assignment.id ? '90deg' : '0deg' }],
                  }}
                />
              </View>

              {selectedAssignment === assignment.id && (
                <Animated.View entering={FadeInUp.duration(200)} style={styles.assignmentDetails}>
                  <View style={[styles.aiOutput, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>
                    <Text style={[styles.aiOutputTitle, { color: isDark ? DarkColors.primary : Colors.primary[700] }]}>AI Suggestions</Text>
                    <View style={styles.aiItem}>
                      <Text style={[styles.aiItemLabel, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Outline</Text>
                      <Text style={[styles.aiItemText, { color: textSecondary }]}>
                        1. Introduction{'\n'}2. Main Body (3 sections){'\n'}3. Conclusion{'\n'}4. References
                      </Text>
                    </View>
                    <View style={styles.aiItem}>
                      <Text style={[styles.aiItemLabel, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Key Research Points</Text>
                      <Text style={[styles.aiItemText, { color: textSecondary }]}>
                        - Review recent literature{'\n'}- Include case studies{'\n'}- Cite primary sources
                      </Text>
                    </View>
                    <View style={styles.aiItem}>
                      <Text style={[styles.aiItemLabel, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>Submission Checklist</Text>
                      <View style={styles.checklist}>
                        {['Format correctly', 'Proofread', 'Cite sources', 'Check word count'].map((item) => (
                          <View key={item} style={styles.checklistItem}>
                            <Circle size={14} color={Colors.primary[500]} />
                            <Text style={[styles.checklistText, { color: textSecondary }]}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </Animated.View>
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
  aiHelpCard: {
    marginBottom: Spacing.lg,
  },
  aiHelpGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  aiHelpTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: Spacing.md,
  },
  aiHelpDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  assignmentCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  assignmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginRight: Spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  priorityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  assignmentDetails: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
  },
  aiOutput: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  aiOutputTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  aiItem: {
    marginBottom: Spacing.md,
  },
  aiItemLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  aiItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  checklist: {
    gap: Spacing.xs,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checklistText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
});
