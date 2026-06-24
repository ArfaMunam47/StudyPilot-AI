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
  Compass,
  Search,
  DollarSign,
  TrendingUp,
  Award,
  ChevronRight,
  Briefcase,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Colors, DarkColors, Gradients, Shadows, Spacing, BorderRadius } from '@/constants/theme';
import { sampleCareers } from '@/constants/data';

interface Career {
  id: string;
  title: string;
  category: string;
  skills: string[];
  certifications: string[];
  outlook: string;
  salary: string;
}

export default function CareerScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [careers] = useState<Career[]>(sampleCareers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    interests: '',
    skills: '',
    subjects: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const bg = isDark ? DarkColors.bg : '#FAFAFA';
  const cardBg = isDark ? DarkColors.surfaceElevated : '#FFFFFF';
  const textPrimary = isDark ? DarkColors.textPrimary : Colors.neutral[900];
  const textSecondary = isDark ? DarkColors.textSecondary : Colors.neutral[500];
  const textMuted = isDark ? DarkColors.textMuted : Colors.neutral[400];

  const filteredCareers = careers.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentCareer = careers.find((c) => c.id === selectedCareer);

  if (currentCareer) {
    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.detailHeader, { backgroundColor: cardBg, borderBottomColor: isDark ? DarkColors.border : Colors.neutral[100] }]}>
          <TouchableOpacity onPress={() => setSelectedCareer(null)} style={[styles.backButton, { backgroundColor: isDark ? DarkColors.surface : Colors.neutral[0] }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.detailTitle, { color: textPrimary }]} numberOfLines={1}>
            {currentCareer.title}
          </Text>
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
            <Text style={[styles.detailSectionTitle, { color: textPrimary }]}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {currentCareer.skills.map((skill, i) => (
                <View key={i} style={[styles.skillChip, { backgroundColor: isDark ? DarkColors.surface : Colors.primary[50] }]}>
                  <Text style={[styles.skillChipText, { color: isDark ? DarkColors.primary : Colors.primary[600] }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.detailSectionTitle, { color: textPrimary }]}>Recommended Certifications</Text>
            {currentCareer.certifications.map((cert, i) => (
              <View key={i} style={styles.certItem}>
                <Award size={16} color={Colors.warning[500]} />
                <Text style={[styles.certText, { color: textSecondary }]}>{cert}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.detailSectionTitle, { color: textPrimary }]}>Learning Roadmap</Text>
            {[
              'Build foundational knowledge',
              'Develop core technical skills',
              'Complete hands-on projects',
              'Earn relevant certifications',
              'Build portfolio and network',
              'Apply for internships/entry roles',
            ].map((step, i) => (
              <View key={i} style={styles.roadmapItem}>
                <View style={styles.roadmapNumber}>
                  <Text style={styles.roadmapNumberText}>{i + 1}</Text>
                </View>
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
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: cardBg }]}>
            <ArrowLeft size={24} color={textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Career Compass</Text>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={[styles.filterButton, { backgroundColor: cardBg }]}>
            <Compass size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: cardBg }]}>
          <Search size={18} color={textMuted} />
          <TextInput
            style={[styles.searchInput, { color: textPrimary }]}
            placeholder="Search careers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={textMuted}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {showFilters && (
          <Animated.View entering={FadeInUp.duration(300)} style={[styles.filtersCard, { backgroundColor: cardBg }]}>
            <Text style={[styles.filtersTitle, { color: textPrimary }]}>Find Your Path</Text>
            <TextInput
              style={[styles.filterInput, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Your interests (e.g., data, design)"
              value={filters.interests}
              onChangeText={(text) => setFilters({ ...filters, interests: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.filterInput, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Your skills (e.g., coding, writing)"
              value={filters.skills}
              onChangeText={(text) => setFilters({ ...filters, skills: text })}
              placeholderTextColor={textMuted}
            />
            <TextInput
              style={[styles.filterInput, { backgroundColor: cardBg, color: textPrimary, borderColor: isDark ? DarkColors.border : Colors.neutral[200] }]}
              placeholder="Favorite subjects"
              value={filters.subjects}
              onChangeText={(text) => setFilters({ ...filters, subjects: text })}
              placeholderTextColor={textMuted}
            />
            <TouchableOpacity style={styles.exploreButton}>
              <LinearGradient colors={Gradients.primary} style={styles.exploreGradient}>
                <Text style={styles.exploreText}>Explore Careers</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recommended Careers</Text>

        {filteredCareers.map((career, index) => (
          <Animated.View key={career.id} entering={FadeInUp.delay(index * 100).duration(400)}>
            <TouchableOpacity
              style={[styles.careerCard, { backgroundColor: cardBg }]}
              onPress={() => setSelectedCareer(career.id)}
            >
              <LinearGradient colors={isDark ? ['#1A1F35', '#232A4A'] : ['#EEF2FF', '#E0E7FF']} style={styles.careerIconBg}>
                <Briefcase size={28} color={Colors.primary[500]} />
              </LinearGradient>
              <View style={styles.careerInfo}>
                <Text style={[styles.careerTitle, { color: textPrimary }]}>{career.title}</Text>
                <Text style={[styles.careerCategory, { color: textSecondary }]}>{career.category}</Text>
                <View style={styles.careerMeta}>
                  <DollarSign size={14} color={Colors.success[500]} />
                  <Text style={[styles.careerSalary, { color: Colors.success[600] }]}>{career.salary}</Text>
                </View>
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
    marginBottom: Spacing.lg,
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
    color: Colors.neutral[900],
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
  },
  filtersCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  filtersTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  exploreButton: {
    marginTop: Spacing.sm,
    ...Shadows.sm,
  },
  exploreGradient: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  exploreText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  careerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    gap: Spacing.md,
  },
  careerIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  careerInfo: {
    flex: 1,
  },
  careerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  careerCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  careerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  careerSalary: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
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
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
  },
  careerHero: {
    borderRadius: BorderRadius['3xl'],
    padding: Spacing['3xl'],
    alignItems: 'center',
    ...Shadows.lg,
    marginBottom: Spacing['2xl'],
  },
  careerHeroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: Spacing.lg,
  },
  careerHeroCategory: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  infoCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  infoValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  sectionCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillChip: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  skillChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  certText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  roadmapNumber: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  roadmapNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  roadmapText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    flex: 1,
  },
});
