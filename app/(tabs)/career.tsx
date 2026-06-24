import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Compass,
  Search,
  ChevronRight,
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, Gradients, DarkColors, Spacing, BorderRadius } from '@/constants/theme';

const careers = [
  {
    id: '1',
    title: 'Software Engineer',
    category: 'Technology',
    skills: ['JavaScript', 'React', 'Node.js', 'Git', 'System Design'],
    certifications: ['AWS Certified Developer', 'Meta Frontend'],
    outlook: 'Strong growth, 25% increase projected',
    salary: '$80,000 - $150,000',
  },
  {
    id: '2',
    title: 'Data Scientist',
    category: 'Technology',
    skills: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
    certifications: ['Google Data Analytics', 'IBM Data Science'],
    outlook: 'High demand, 35% growth expected',
    salary: '$95,000 - $165,000',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    category: 'Technology',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud', 'Linux'],
    certifications: ['AWS Certified DevOps', 'CKA'],
    outlook: 'Critical role, 30% growth projected',
    salary: '$90,000 - $160,000',
  },
  {
    id: '4',
    title: 'AI/ML Engineer',
    category: 'Technology',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning'],
    certifications: ['Google ML Engineer', 'AWS ML Specialty'],
    outlook: 'Explosive growth in AI sector',
    salary: '$100,000 - $180,000',
  },
];

export default function CareerTabScreen() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const filteredCareers = careers.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCareer = careers.find((c) => c.id === selectedCareer);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  if (currentCareer) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.detailHeader, { backgroundColor: bg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setSelectedCareer(null)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[100] }]}>
            <Compass size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]} numberOfLines={1}>{currentCareer.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInUp.duration(400)}>
            <LinearGradient colors={Gradients.primary} style={styles.careerHero}>
              <Briefcase size={40} color="#FFFFFF" />
              <Text style={styles.careerHeroTitle}>{currentCareer.title}</Text>
              <Text style={styles.careerHeroCategory}>{currentCareer.category}</Text>
            </LinearGradient>
          </Animated.View>

          <View style={styles.infoGrid}>
            <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
              <DollarSign size={20} color={Colors.success[500]} />
              <Text style={[styles.infoValue, { color: textPrimary }]}>{currentCareer.salary}</Text>
              <Text style={[styles.infoLabel, { color: textSecondary }]}>Salary Range</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
              <TrendingUp size={20} color={Colors.primary[500]} />
              <Text style={[styles.infoValue, { color: textPrimary }]} numberOfLines={2}>{currentCareer.outlook}</Text>
              <Text style={[styles.infoLabel, { color: textSecondary }]}>Outlook</Text>
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {currentCareer.skills.map((skill, i) => (
                <View key={i} style={[styles.skillChip, { backgroundColor: isDark ? DarkColors.surfaceHighlight : Colors.primary[50] }]}>
                  <Text style={[styles.skillChipText, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>Recommended Certifications</Text>
            {currentCareer.certifications.map((cert, i) => (
              <View key={i} style={[styles.certItem, { borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
                <Award size={16} color={Colors.warning[500]} />
                <Text style={[styles.certText, { color: textSecondary }]}>{cert}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.sectionCardTitle, { color: textPrimary }]}>Learning Roadmap</Text>
            {[
              'Build foundational knowledge',
              'Develop core technical skills',
              'Complete hands-on projects',
              'Earn relevant certifications',
              'Build portfolio and network',
              'Apply for internships/entry roles',
            ].map((step, i) => (
              <View key={i} style={[styles.roadmapItem, { borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
                <View style={styles.roadmapNumber}><Text style={styles.roadmapNumberText}>{i + 1}</Text></View>
                <Text style={[styles.roadmapText, { color: textSecondary }]}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <LinearGradient colors={isDark ? ['#131827', '#0B0E17'] : ['#F0F4FF', '#FAFAFA']} style={styles.header}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Career Compass</Text>
        <View style={[styles.searchContainer, { backgroundColor: cardBg }]}>
          <Search size={18} color={textMuted} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            placeholder="Explore career paths..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={textMuted}
          />
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <LinearGradient colors={isDark ? [DarkColors.surfaceHighlight, DarkColors.surface] : ['#EEF2FF', '#E0E7FF']} style={styles.introGradient}>
            <Compass size={32} color={Colors.primary[500]} />
            <Text style={[styles.introTitle, { color: isDark ? DarkColors.primary : Colors.primary[700] }]}>Discover Your Path</Text>
            <Text style={[styles.introDesc, { color: isDark ? DarkColors.textSecondary : Colors.primary[600] }]}>
              Explore careers based on your interests, skills, and subjects
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={[styles.listSectionTitle, { color: textPrimary }]}>Career Paths</Text>
          {filteredCareers.map((career, index) => (
            <Animated.View key={career.id} entering={FadeInUp.delay(index * 100).duration(400)}>
              <TouchableOpacity style={[styles.careerCard, { backgroundColor: cardBg }]} onPress={() => setSelectedCareer(career.id)}>
                <LinearGradient colors={isDark ? [DarkColors.surfaceHighlight, DarkColors.surface] : ['#EEF2FF', '#E0E7FF']} style={styles.careerIconBg}>
                  <Briefcase size={28} color={Colors.primary[500]} />
                </LinearGradient>
                <View style={styles.careerInfo}>
                  <Text style={[styles.careerCardTitle, { color: textPrimary }]}>{career.title}</Text>
                  <Text style={[styles.careerCategory, { color: textSecondary }]}>{career.category}</Text>
                  <View style={styles.careerMeta}>
                    <DollarSign size={14} color={Colors.success[500]} />
                    <Text style={styles.careerSalary}>{career.salary}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={textMuted} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-Bold', fontSize: 28, marginBottom: Spacing.lg },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.full, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, gap: Spacing.sm },
  searchInput: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 14 },
  introCard: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'] },
  introGradient: { borderRadius: BorderRadius.xl, padding: Spacing['2xl'], alignItems: 'center' },
  introTitle: { fontFamily: 'Inter-Bold', fontSize: 18, marginTop: Spacing.md },
  introDesc: { fontFamily: 'Inter-Regular', fontSize: 13, textAlign: 'center', marginTop: Spacing.xs, lineHeight: 20 },
  section: { paddingHorizontal: Spacing['2xl'], marginTop: Spacing['2xl'] },
  listSectionTitle: { fontFamily: 'Inter-Bold', fontSize: 18, marginBottom: Spacing.lg },
  careerCard: { flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, gap: Spacing.md },
  careerIconBg: { width: 56, height: 56, borderRadius: BorderRadius.lg, justifyContent: 'center', alignItems: 'center' },
  careerInfo: { flex: 1 },
  careerCardTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15 },
  careerCategory: { fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  careerMeta: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  careerSalary: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.success[600] },
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: Spacing['2xl'], paddingBottom: Spacing.lg, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, borderRadius: BorderRadius.full, justifyContent: 'center', alignItems: 'center' },
  detailTitle: { fontFamily: 'Inter-Bold', fontSize: 16, flex: 1, textAlign: 'center', marginHorizontal: Spacing.md },
  detailContent: { flex: 1, paddingHorizontal: Spacing['2xl'], paddingTop: Spacing.lg },
  careerHero: { borderRadius: BorderRadius['3xl'], padding: Spacing['3xl'], alignItems: 'center', shadowColor: '#6366F1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 12, marginBottom: Spacing['2xl'] },
  careerHeroTitle: { fontFamily: 'Inter-Bold', fontSize: 24, color: '#FFFFFF', marginTop: Spacing.lg },
  careerHeroCategory: { fontFamily: 'Inter-Regular', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
  infoGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing['2xl'] },
  infoCard: { flex: 1, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  infoValue: { fontFamily: 'Inter-Bold', fontSize: 14, marginTop: Spacing.sm, textAlign: 'center' },
  infoLabel: { fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 2 },
  sectionCard: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  sectionCardTitle: { fontFamily: 'Inter-Bold', fontSize: 16, marginBottom: Spacing.md },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  skillChip: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  skillChipText: { fontFamily: 'Inter-Medium', fontSize: 12 },
  certItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm, borderBottomWidth: 1 },
  certText: { fontFamily: 'Inter-Regular', fontSize: 14 },
  roadmapItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  roadmapNumber: { width: 28, height: 28, borderRadius: BorderRadius.full, backgroundColor: Colors.primary[500], justifyContent: 'center', alignItems: 'center' },
  roadmapNumberText: { fontFamily: 'Inter-Bold', fontSize: 12, color: '#FFFFFF' },
  roadmapText: { fontFamily: 'Inter-Regular', fontSize: 14, flex: 1 },
});
