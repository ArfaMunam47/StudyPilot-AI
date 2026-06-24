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
  HelpCircle,
  Plus,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';
import { sampleQuizzes } from '@/constants/data';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  type: 'mcq' | 'truefalse' | 'short';
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: Question[];
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'Which data structure operates on a LIFO principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Array'],
    correctIndex: 1,
    type: 'mcq',
  },
  {
    id: '2',
    text: 'What is the average time complexity of quicksort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 1,
    type: 'mcq',
  },
  {
    id: '3',
    text: 'In OOP, which concept allows a class to inherit from multiple classes?',
    options: ['Polymorphism', 'Encapsulation', 'Multiple Inheritance', 'Abstraction'],
    correctIndex: 2,
    type: 'mcq',
  },
  {
    id: '4',
    text: 'Which normal form eliminates transitive dependency?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctIndex: 2,
    type: 'mcq',
  },
  {
    id: '5',
    text: 'What does the acronym REST stand for in Web Development?',
    options: ['Representational State Transfer', 'Remote State Transfer', 'Resource State Transfer', 'Reactive State Transfer'],
    correctIndex: 0,
    type: 'mcq',
  },
  {
    id: '6',
    text: 'Which sorting algorithm has the worst-case time complexity of O(n log n)?',
    options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
    correctIndex: 2,
    type: 'mcq',
  },
  {
    id: '7',
    text: 'In Software Engineering, what does TDD stand for?',
    options: ['Technical Design Document', 'Test-Driven Development', 'Total Data Design', 'Tool Deployment Descriptor'],
    correctIndex: 1,
    type: 'mcq',
  },
  {
    id: '8',
    text: 'Which data structure is best suited for implementing a priority queue?',
    options: ['Stack', 'Heap', 'Hash Map', 'Binary Search Tree'],
    correctIndex: 1,
    type: 'mcq',
  },
  {
    id: '9',
    text: 'What is the primary purpose of an index in a Database System?',
    options: ['To enforce referential integrity', 'To speed up query performance', 'To encrypt sensitive data', 'To normalize tables'],
    correctIndex: 1,
    type: 'mcq',
  },
  {
    id: '10',
    text: 'Which HTTP method is idempotent and typically used to update a resource?',
    options: ['POST', 'PATCH', 'PUT', 'DELETE'],
    correctIndex: 2,
    type: 'mcq',
  },
  {
    id: '11',
    text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctIndex: 2,
    type: 'mcq',
  },
  {
    id: '12',
    text: 'Which OOP principle hides internal implementation details from the outside world?',
    options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Composition'],
    correctIndex: 2,
    type: 'mcq',
  },
];

export default function QuizScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [quizzes, setQuizzes] = useState(sampleQuizzes);
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState('');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleGenerate = () => {
    if (!topic) return;
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: `${topic} Quiz`,
      subject: topic,
      questions: sampleQuestions.map((q) => ({ ...q, id: Math.random().toString() })),
    };
    setQuizzes([{ ...newQuiz, questions: [], score: 0, total: newQuiz.questions.length, date: new Date().toISOString().split('T')[0] } as any, ...quizzes]);
    setActiveQuiz(newQuiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setTopic('');
    setShowForm(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
  };

  const getScore = () => {
    if (!activeQuiz) return 0;
    return answers.reduce((acc, answer, i) => {
      return acc + (answer === activeQuiz.questions[i].correctIndex ? 1 : 0);
    }, 0);
  };

  if (activeQuiz) {
    if (showResult) {
      const score = getScore();
      const percentage = Math.round((score / activeQuiz.questions.length) * 100);

      return (
        <View style={[styles.container, { backgroundColor: bg }]}>
          <View style={[styles.resultHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
            <TouchableOpacity onPress={() => setActiveQuiz(null)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
              <ArrowLeft size={24} color={textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.resultHeaderTitle, { color: textPrimary }]}>Quiz Complete</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.resultContent}>
            <Animated.View entering={FadeInUp.duration(500)}>
              <LinearGradient colors={Gradients.primary} style={styles.scoreCard}>
                <Trophy size={48} color="#FFFFFF" />
                <Text style={styles.scoreValue}>{percentage}%</Text>
                <Text style={styles.scoreLabel}>
                  {score} / {activeQuiz.questions.length} correct
                </Text>
              </LinearGradient>
            </Animated.View>

            <View style={styles.reviewSection}>
              <Text style={[styles.reviewTitle, { color: textPrimary }]}>Review Answers</Text>
              {activeQuiz.questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctIndex;
                return (
                  <View key={q.id} style={[styles.reviewItem, { backgroundColor: cardBg }]}>
                    <View style={styles.reviewHeader}>
                      {isCorrect ? (
                        <CheckCircle size={20} color={Colors.success[500]} />
                      ) : (
                        <XCircle size={20} color={Colors.error[500]} />
                      )}
                      <Text style={[styles.reviewQuestion, { color: textPrimary }]}>{q.text}</Text>
                    </View>
                    <Text style={[styles.reviewAnswer, { color: textSecondary }]}>
                      Your answer: {q.options[answers[i]]}
                    </Text>
                    {!isCorrect && (
                      <Text style={[styles.reviewCorrect, { color: Colors.success[600] }]}>
                        Correct: {q.options[q.correctIndex]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
              <LinearGradient colors={Gradients.primary} style={styles.restartGradient}>
                <RotateCcw size={18} color="#FFFFFF" />
                <Text style={styles.restartText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    const question = activeQuiz.questions[currentQuestion];

    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.quizHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setActiveQuiz(null)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.quizTitle, { color: textPrimary }]}>{activeQuiz.title}</Text>
          <Text style={[styles.quizCounter, { color: Colors.primary[500] }]}>
            {currentQuestion + 1} / {activeQuiz.questions.length}
          </Text>
        </View>

        <View style={[styles.progressBar, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[200] }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%`,
              },
            ]}
          />
        </View>

        <ScrollView style={styles.quizContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            key={currentQuestion}
            entering={FadeInUp.duration(300)}
            style={[styles.questionCard, { backgroundColor: cardBg }]}
          >
            <View style={styles.questionBadge}>
              <Text style={[styles.questionBadgeText, { color: Colors.primary[600] }]}>{question.type.toUpperCase()}</Text>
            </View>
            <Text style={[styles.questionText, { color: textPrimary }]}>{question.text}</Text>
          </Animated.View>

          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  { backgroundColor: cardBg },
                  selectedAnswer === index && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswer(index)}
              >
                <View
                  style={[
                    styles.optionCircle,
                    selectedAnswer === index && styles.optionCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionCircleText,
                      selectedAnswer === index && styles.optionCircleTextSelected,
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    { color: textSecondary },
                    selectedAnswer === index && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.quizFooter, { backgroundColor: cardBg, borderTopColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity
            style={[styles.nextButton, selectedAnswer === null && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={selectedAnswer === null}
          >
            <LinearGradient colors={Gradients.primary} style={styles.nextGradient}>
              <Text style={styles.nextText}>
                {currentQuestion === activeQuiz.questions.length - 1 ? 'Finish' : 'Next'}
              </Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </LinearGradient>
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
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Quiz Generator</Text>
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
            <Text style={[styles.formTitle, { color: textPrimary }]}>Generate Quiz</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Enter topic or paste notes"
              value={topic}
              onChangeText={setTopic}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleGenerate}>
              <LinearGradient colors={Gradients.primary} style={styles.submitGradient}>
                <Text style={styles.submitText}>Generate Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recent Quizzes</Text>

        {quizzes.map((quiz, index) => (
          <Animated.View key={quiz.id} entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
              style={[styles.quizCard, { backgroundColor: cardBg }]}
              onPress={() => {
                const fullQuiz: Quiz = {
                  id: quiz.id,
                  title: quiz.title,
                  subject: quiz.subject,
                  questions: sampleQuestions,
                };
                setActiveQuiz(fullQuiz);
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setAnswers([]);
                setShowResult(false);
              }}
            >
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#FEE2E2', '#FECACA']} style={styles.quizIconBg}>
                <HelpCircle size={28} color={Colors.error[500]} />
              </LinearGradient>
              <View style={styles.quizInfo}>
                <Text style={[styles.quizCardTitle, { color: textPrimary }]}>{quiz.title}</Text>
                <Text style={[styles.quizCardMeta, { color: textSecondary }]}>{quiz.subject}</Text>
              </View>
              <View style={styles.quizScore}>
                <Text style={[styles.quizScoreText, { color: Colors.success[600] }]}>
                  {quiz.score}/{quiz.total}
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
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  quizIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizInfo: {
    flex: 1,
  },
  quizCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  quizCardMeta: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  quizScore: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success[100],
  },
  quizScoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  quizTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  quizCounter: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  progressBar: {
    height: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
  },
  quizContent: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  questionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  questionBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  questionText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary[50],
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    backgroundColor: Colors.primary[500],
  },
  optionCircleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: Colors.neutral[500],
  },
  optionCircleTextSelected: {
    color: '#FFFFFF',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    flex: 1,
  },
  optionTextSelected: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary[700],
  },
  quizFooter: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
  },
  nextButton: {
    ...Shadows.sm,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  nextText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  resultHeaderTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  resultContent: {
    padding: Spacing['2xl'],
  },
  scoreCard: {
    borderRadius: BorderRadius['3xl'],
    padding: Spacing['3xl'],
    alignItems: 'center',
    ...Shadows.lg,
  },
  scoreValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#FFFFFF',
    marginTop: Spacing.lg,
  },
  scoreLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.xs,
  },
  reviewSection: {
    marginTop: Spacing['2xl'],
  },
  reviewTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  reviewItem: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reviewQuestion: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    flex: 1,
  },
  reviewAnswer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  reviewCorrect: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginTop: 2,
  },
  restartButton: {
    marginTop: Spacing['2xl'],
    ...Shadows.md,
  },
  restartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  restartText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
