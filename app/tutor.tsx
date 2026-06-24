import { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Bot, User, BookOpen, Code, Hash, Database, Globe } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, DarkColors, Gradients, Spacing, BorderRadius } from '@/constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickQuestions = [
  { icon: BookOpen, label: 'Explain Big O notation' },
  { icon: Code, label: 'What is a hash table?' },
  { icon: Database, label: 'Explain SQL joins' },
  { icon: Hash, label: 'Difference between stack and queue' },
];

const sampleResponses: Record<string, string> = {
  'Explain Big O notation':
    'Big O notation describes the performance or complexity of an algorithm. It tells you how much an algorithm\'s runtime or space requirements grow relative to the input size.\n\n**Common complexities:**\n• O(1) — Constant time\n• O(log n) — Logarithmic (binary search)\n• O(n) — Linear (simple loop)\n• O(n log n) — Linearithmic (merge sort)\n• O(n²) — Quadratic (nested loops)\n• O(2ⁿ) — Exponential (recursive Fibonacci)',
  'What is a hash table?':
    'A hash table is a data structure that implements an associative array abstract data type, mapping keys to values.\n\n**How it works:**\n• A hash function computes an index into an array of buckets\n• The key-value pair is stored in the corresponding bucket\n• Collisions are handled via chaining or open addressing\n\n**Average case:** O(1) for insert, delete, and search\n**Worst case:** O(n) when all keys hash to same bucket',
  'Explain SQL joins':
    'SQL joins combine rows from two or more tables based on a related column.\n\n**Types of joins:**\n• INNER JOIN — Returns matching rows from both tables\n• LEFT JOIN — Returns all rows from left table, matched from right\n• RIGHT JOIN — Returns all rows from right table, matched from left\n• FULL OUTER JOIN — Returns all rows when there is a match in either table\n• CROSS JOIN — Cartesian product of both tables',
  'Difference between stack and queue':
    'Stack and Queue are both linear data structures, but they differ in how elements are accessed.\n\n**Stack (LIFO):**\n• Last In, First Out\n• Push and Pop operations\n• Used for: function call stack, undo operations, expression evaluation\n\n**Queue (FIFO):**\n• First In, First Out\n• Enqueue and Dequeue operations\n• Used for: task scheduling, print queues, BFS algorithm',
};

export default function TutorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: "Hello! I'm your AI Tutor. I can help you understand CS concepts, solve problems, and prepare for exams. What would you like to learn today?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = sampleResponses[userMsg.content] ||
        `That's a great question about ${userMsg.content}!\n\nIn computer science, understanding the fundamentals is key. Let me break this down:\n\n**Key Concepts:**\n• This topic is foundational to software engineering\n• Practice with hands-on coding exercises\n• Review related data structures and algorithms\n\nWould you like me to explain a specific aspect in more detail?`;
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response }]);
      setIsTyping(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 800);
  };

  const handleQuickQuestion = (label: string) => {
    setInput(label);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><ArrowLeft size={24} color={textPrimary} /></TouchableOpacity>
          <View style={styles.headerCenter}>
            <LinearGradient colors={Gradients.primary} style={styles.botIcon}>
              <Bot size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>AI Tutor</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView ref={scrollViewRef} style={styles.chat} showsVerticalScrollIndicator={false} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageRow, msg.role === 'user' ? styles.userRow : styles.assistantRow]}>
            {msg.role === 'assistant' && (
              <LinearGradient colors={Gradients.primary} style={styles.messageAvatar}>
                <Bot size={14} color="#FFFFFF" />
              </LinearGradient>
            )}
            <View style={[styles.messageBubble, msg.role === 'user' ? { backgroundColor: Colors.primary[500] } : { backgroundColor: cardBg }]}>
              <Text style={[styles.messageText, msg.role === 'user' ? { color: '#FFFFFF' } : { color: textPrimary }]}>{msg.content}</Text>
            </View>
            {msg.role === 'user' && (
              <View style={[styles.messageAvatar, { backgroundColor: Colors.neutral[200] }]}>
                <User size={14} color={Colors.neutral[600]} />
              </View>
            )}
          </View>
        ))}
        {isTyping && (
          <View style={[styles.typingBubble, { backgroundColor: cardBg }]}>
            <Text style={[styles.typingText, { color: textMuted }]}>AI is typing...</Text>
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.quickQuestions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {quickQuestions.map((q) => (
            <TouchableOpacity key={q.label} style={[styles.quickChip, { backgroundColor: cardBg }]} onPress={() => handleQuickQuestion(q.label)}>
              <q.icon size={14} color={Colors.primary[500]} />
              <Text style={[styles.quickChipText, { color: textSecondary }]}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.inputBar, { backgroundColor: cardBg, borderTopColor: isDark ? DarkColors.border : Colors.neutral[200] }]}>
        <TextInput
          style={[styles.input, { color: textPrimary }]}
          placeholder="Ask anything about CS..."
          placeholderTextColor={textMuted}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={!input.trim()}>
          <LinearGradient colors={Gradients.primary} style={[styles.sendGradient, !input.trim() && { opacity: 0.4 }]}>
            <Send size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1, justifyContent: 'center' },
  botIcon: { width: 36, height: 36, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-Bold', fontSize: 18 },
  chat: { flex: 1, paddingHorizontal: Spacing['2xl'] },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.md, gap: Spacing.sm },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  messageAvatar: { width: 28, height: 28, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  messageBubble: { maxWidth: '80%', borderRadius: BorderRadius.xl, padding: Spacing.lg },
  messageText: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },
  typingBubble: { alignSelf: 'flex-start', borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: Spacing.md },
  typingText: { fontFamily: 'Inter-Regular', fontSize: 12 },
  quickQuestions: { paddingVertical: Spacing.sm },
  quickRow: { paddingHorizontal: Spacing['2xl'], gap: Spacing.sm },
  quickChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1 },
  quickChipText: { fontFamily: 'Inter-Medium', fontSize: 12 },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing['2xl'], paddingVertical: Spacing.md, borderTopWidth: 1, gap: Spacing.sm },
  input: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 15, maxHeight: 80 },
  sendBtn: { shadowColor: '#6366F1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  sendGradient: { width: 40, height: 40, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
});
