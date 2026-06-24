import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  { icon: BookOpen, label: 'Explain Big O notation' },
  { icon: Calculator, label: 'Solve: derivative of x²' },
  { icon: Atom, label: 'What is a hash table?' },
  { icon: FlaskConical, label: 'Explain SQL joins' },
];

const sampleResponses: Record<string, string> = {
  'Explain photosynthesis':
    'Photosynthesis is the process by which plants, algae, and some bacteria convert light energy (usually from the sun) into chemical energy stored in glucose.\n\n**Key steps:**\n1. Light absorption by chlorophyll\n2. Water splitting (photolysis)\n3. Carbon dioxide fixation\n4. Glucose synthesis\n\nThe overall equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
  'Solve: derivative of x²':
    'Using the power rule: d/dx(xⁿ) = n·xⁿ⁻¹\n\nFor f(x) = x²:\n• n = 2\n• f\'(x) = 2·x²⁻¹ = 2x\n\n**Answer: 2x**\n\nAt any point x, the slope of the tangent line to y = x² is 2x.',
  'What is quantum mechanics?':
    'Quantum mechanics is the branch of physics that describes the behavior of matter and energy at the smallest scales—atoms and subatomic particles.\n\n**Key principles:**\n• Wave-particle duality\n• Uncertainty principle\n• Quantum superposition\n• Quantum entanglement\n\nIt revolutionized our understanding of nature and led to technologies like lasers, transistors, and MRI scanners.',
  'Chemistry periodic trends':
    'Periodic trends are patterns in elemental properties across the periodic table:\n\n**Atomic radius:** Increases down a group, decreases across a period\n**Ionization energy:** Decreases down a group, increases across a period\n**Electronegativity:** Increases across a period (F is highest)\n**Metallic character:** Increases down a group, decreases across a period\n\nThese trends are driven by nuclear charge and electron shielding effects.',
};

export default function TutorScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello! I'm your AI Tutor. I can help you understand concepts, solve problems, and prepare for exams. What would you like to learn today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response =
        sampleResponses[text] ||
        `That's a great question about "${text}"! Here's what I can tell you:\n\n• This topic involves several key concepts worth exploring\n• Breaking it down into smaller parts helps with understanding\n• Practice problems will reinforce your learning\n\nWould you like me to go deeper into any specific aspect?`;

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: bg }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.header, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[100] }]}>
          <ArrowLeft size={24} color={textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <LinearGradient colors={Gradients.primary} style={styles.botIcon}>
            <Bot size={20} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: textPrimary }]}>AI Tutor</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 1 && (
          <View style={styles.quickQuestions}>
            <Text style={[styles.quickTitle, { color: textSecondary }]}>Quick Questions</Text>
            <View style={styles.quickGrid}>
              {quickQuestions.map((q, i) => {
                const Icon = q.icon;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.quickButton, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50], borderColor: isDark ? DarkColors.border : Colors.primary[200] }]}
                    onPress={() => sendMessage(q.label)}
                  >
                    <Icon size={18} color={Colors.primary[500]} />
                    <Text style={[styles.quickButtonText, { color: Colors.primary[700] }]}>{q.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {messages.map((msg, index) => (
          <Animated.View
            key={msg.id}
            entering={FadeInUp.delay(100).duration(300)}
            style={[
              styles.messageRow,
              msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
            ]}
          >
            {msg.role === 'assistant' && (
              <LinearGradient colors={Gradients.primary} style={styles.messageAvatar}>
                <Bot size={14} color="#FFFFFF" />
              </LinearGradient>
            )}
            <View
              style={[
                styles.messageBubble,
                msg.role === 'user' ? { backgroundColor: Colors.primary[500] } : [styles.assistantBubble, { backgroundColor: cardBg }],
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : [styles.assistantText, { color: textPrimary }],
                ]}
              >
                {msg.content}
              </Text>
            </View>
            {msg.role === 'user' && (
              <View style={[styles.userAvatar, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[200] }]}>
                <User size={14} color={textMuted} />
              </View>
            )}
          </Animated.View>
        ))}

        {isTyping && (
          <View style={styles.typingIndicator}>
            <LinearGradient colors={Gradients.primary} style={styles.typingAvatar}>
              <Bot size={14} color="#FFFFFF" />
            </LinearGradient>
            <View style={[styles.typingBubble, { backgroundColor: cardBg }]}>
              <Text style={[styles.typingText, { color: textSecondary }]}>Thinking...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: cardBg, borderTopColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[100], color: textPrimary }]}
          placeholder="Ask anything..."
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          placeholderTextColor={textMuted}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <LinearGradient colors={Gradients.primary} style={styles.sendGradient}>
            <Send size={18} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  headerStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.success[500],
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing['2xl'],
    paddingBottom: Spacing.lg,
  },
  quickQuestions: {
    marginBottom: Spacing.lg,
  },
  quickTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  quickButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
    ...Shadows.sm,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: Colors.neutral[900],
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typingAvatar: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingBubble: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderBottomLeftRadius: 4,
    ...Shadows.sm,
  },
  typingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    ...Shadows.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
