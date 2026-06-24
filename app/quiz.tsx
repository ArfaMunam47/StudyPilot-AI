import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft, HelpCircle, Plus, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

const csQuestions = [
  { text: 'Which data structure operates on a LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Array'], correctIndex: 1 },
  { text: 'What is the average time complexity of quicksort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1 },
  { text: 'In OOP, which concept allows a class to inherit from multiple classes?', options: ['Polymorphism', 'Encapsulation', 'Multiple Inheritance', 'Abstraction'], correctIndex: 2 },
  { text: 'Which normal form eliminates transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctIndex: 2 },
  { text: 'What does REST stand for?', options: ['Representational State Transfer', 'Remote State Transfer', 'Resource State Transfer', 'Reactive State Transfer'], correctIndex: 0 },
  { text: 'Which sorting algorithm has worst-case O(n log n)?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], correctIndex: 2 },
  { text: 'What does TDD stand for?', options: ['Technical Design Document', 'Test-Driven Development', 'Total Data Design', 'Tool Deployment Descriptor'], correctIndex: 1 },
  { text: 'Which data structure is best for a priority queue?', options: ['Stack', 'Heap', 'Hash Map', 'Binary Search Tree'], correctIndex: 1 },
  { text: 'What is the primary purpose of a database index?', options: ['Enforce referential integrity', 'Speed up query performance', 'Encrypt sensitive data', 'Normalize tables'], correctIndex: 1 },
  { text: 'Which HTTP method is idempotent for updating a resource?', options: ['POST', 'PATCH', 'PUT', 'DELETE'], correctIndex: 2 },
];

export default function QuizScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('quiz_results').select('*').eq('user_id', user.id).order('taken_at', { ascending: false });
    setQuizzes(data || []);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  function handleGenerate() {
    if (!topic) return;
    const questions = csQuestions.slice(0, 5).map((q, i) => ({ ...q, id: i }));
    setActiveQuiz({ title: `${topic} Quiz`, subject: topic, questions });
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setTopic('');
    setShowForm(false);
  }

  function handleAnswer(index: number) { setSelectedAnswer(index); }

  function handleNext() {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    if (currentQ < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  }

  async function saveResult() {
    if (!user || !activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctIndex) score++;
    });
    await supabase.from('quiz_results').insert({
      user_id: user.id,
      title: activeQuiz.title,
      subject: activeQuiz.subject,
      score,
      total: activeQuiz.questions.length,
      questions: activeQuiz.questions,
    });
    setActiveQuiz(null);
    setAnswers([]);
    setShowResult(false);
    await loadData();
  }

  function resetQuiz() {
    setActiveQuiz(null);
    setAnswers([]);
    setShowResult(false);
    setCurrentQ(0);
    setSelectedAnswer(null);
  }

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  if (activeQuiz) {
    if (showResult) {
      const score = answers.filter((a, i) => a === activeQuiz.questions[i].correctIndex).length;
      const percentage = Math.round((score / activeQuiz.questions.length) * 100);
      return (
        <View style={[styles.container, { backgroundColor: bg }]}>
          <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
            <TouchableOpacity onPress={resetQuiz} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>Quiz Results</Text>
            <View style={{ width: 40 }} />
          </LinearGradient>
          <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={percentage >= 70 ? Gradients.success : percentage >= 40 ? Gradients.accent : Gradients.error} style={styles.resultCircle}>
              <Text style={styles.resultScore}>{percentage}%</Text>
              <Text style={styles.resultLabel}>{score}/{activeQuiz.questions.length} correct</Text>
            </LinearGradient>
            <Text style={[styles.resultMessage, { color: textPrimary }]}>
              {percentage >= 80 ? 'Excellent work!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}
            </Text>
            <TouchableOpacity style={styles.saveBtn} onPress={saveResult}>
              <LinearGradient colors={Gradients.primary} style={styles.saveGradient}>
                <Text style={styles.saveText}>Save Result</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.retryBtn} onPress={resetQuiz}>
              <Text style={[styles.retryText, { color: Colors.primary[500] }]}>Try Another Quiz</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    const q = activeQuiz.questions[currentQ];
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
          <TouchableOpacity onPress={resetQuiz} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>{activeQuiz.title}</Text>
          <Text style={[styles.progressText, { color: textMuted }]}>{currentQ + 1}/{activeQuiz.questions.length}</Text>
        </LinearGradient>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.questionCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.questionText, { color: textPrimary }]}>{q.text}</Text>
            <View style={styles.options}>
              {q.options.map((opt: string, i: number) => (
                <TouchableOpacity key={i} style={[styles.optionBtn, selectedAnswer === i && { borderColor: Colors.primary[500], backgroundColor: Colors.primary[50] }]} onPress={() => handleAnswer(i)}>
                  <Text style={[styles.optionText, { color: textPrimary }]}>{opt}</Text>
                  {selectedAnswer === i && <CheckCircle size={18} color={Colors.primary[500]} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={[styles.nextBtn, selectedAnswer === null && { opacity: 0.5 }]} onPress={handleNext} disabled={selectedAnswer === null}>
            <LinearGradient colors={Gradients.primary} style={styles.nextGradient}>
              <Text style={styles.nextText}>Next</Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
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
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Quiz</Text>
          <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addBtn}>
            <LinearGradient colors={Gradients.primary} style={styles.addGradient}>
              {showForm ? <XCircle size={18} color="#FFFFFF" /> : <Plus size={18} color="#FFFFFF" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[500]} />}>
        {showForm && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.formCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.formTitle, { color: textPrimary }]}>Generate Quiz</Text>
            <TextInput style={[styles.formInput, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.neutral[100], color: textPrimary }]} placeholder="Topic (e.g., Data Structures)" placeholderTextColor={textMuted} value={topic} onChangeText={setTopic} />
            <TouchableOpacity style={styles.submitBtn} onPress={handleGenerate}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Start Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {quizzes.map((q, i) => (
          <Animated.View key={q.id} entering={FadeInUp.delay(i * 50).duration(400)}>
            <View style={[styles.quizCard, { backgroundColor: cardBg }]}>
              <View style={styles.quizLeft}>
                <LinearGradient colors={Gradients.primary} style={styles.quizIcon}>
                  <HelpCircle size={20} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={[styles.quizTitle, { color: textPrimary }]}>{q.title}</Text>
                  <Text style={[styles.quizSubject, { color: textSecondary }]}>{q.subject}</Text>
                </View>
              </View>
              <View style={styles.quizRight}>
                <Text style={[styles.quizScore, { color: q.score / q.total >= 0.7 ? Colors.success[500] : q.score / q.total >= 0.4 ? Colors.warning[500] : Colors.error[500] }]}>{q.score}/{q.total}</Text>
                <Text style={[styles.quizDate, { color: textMuted }]}>{new Date(q.taken_at).toLocaleDateString()}</Text>
              </View>
            </View>
          </Animated.View>
        ))}

        {quizzes.length === 0 && !showForm && (
          <View style={styles.empty}>
            <HelpCircle size={48} color={textMuted} />
            <Text style={[styles.emptyText, { color: textMuted }]}>No quizzes yet</Text>
            <Text style={[styles.emptySub, { color: textSecondary }]}>Tap + to generate a quiz</Text>
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
  quizCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quizLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  quizIcon: { width: 44, height: 44, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  quizTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  quizSubject: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  quizRight: { alignItems: 'flex-end' },
  quizScore: { fontFamily: 'Inter-Bold', fontSize: 16 },
  quizDate: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: Spacing['4xl'] },
  emptyText: { fontFamily: 'Inter-Medium', fontSize: 16, marginTop: Spacing.lg },
  emptySub: { fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.xs },
  questionCard: { marginHorizontal: Spacing['2xl'], borderRadius: BorderRadius.xl, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  questionText: { fontFamily: 'Inter-SemiBold', fontSize: 16, marginBottom: Spacing.lg, lineHeight: 24 },
  options: { gap: Spacing.sm },
  optionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: Colors.neutral[200], borderRadius: BorderRadius.lg, padding: Spacing.lg },
  optionText: { fontFamily: 'Inter-Regular', fontSize: 14, flex: 1 },
  nextBtn: { marginHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'], borderRadius: BorderRadius.xl, overflow: 'hidden' },
  nextGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.lg, gap: Spacing.sm },
  nextText: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#FFFFFF' },
  resultContent: { paddingHorizontal: Spacing['2xl'], paddingTop: Spacing['3xl'], alignItems: 'center' },
  resultCircle: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing['2xl'] },
  resultScore: { fontFamily: 'Inter-Bold', fontSize: 40, color: '#FFFFFF' },
  resultLabel: { fontFamily: 'Inter-Medium', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
  resultMessage: { fontFamily: 'Inter-Bold', fontSize: 20, marginBottom: Spacing['2xl'] },
  saveBtn: { width: '100%', borderRadius: BorderRadius.xl, overflow: 'hidden', marginBottom: Spacing.md },
  saveGradient: { paddingVertical: Spacing.lg, alignItems: 'center' },
  saveText: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#FFFFFF' },
  retryBtn: { paddingVertical: Spacing.lg },
  retryText: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
});
