import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { Award, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const ACHIEVEMENTS = [
  {
    category: 'Milestones',
    items: [
      {
        id: '1',
        title: 'First Plunge',
        description: 'Complete your first ice bath session',
        requirement: '1 session',
        xp: 100,
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '2',
        title: 'Ice Master',
        description: 'Complete 50 ice bath sessions',
        requirement: '50 sessions',
        xp: 1000,
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Duration',
    items: [
      {
        id: '3',
        title: 'Endurance I',
        description: 'Complete a 5-minute session',
        requirement: '5 minutes',
        xp: 200,
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '4',
        title: 'Endurance II',
        description: 'Complete a 10-minute session',
        requirement: '10 minutes',
        xp: 500,
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Consistency',
    items: [
      {
        id: '5',
        title: 'Early Bird',
        description: 'Complete 3 morning sessions',
        requirement: '3 morning sessions',
        xp: 300,
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '6',
        title: 'Weekend Warrior',
        description: 'Complete sessions on Saturday and Sunday',
        requirement: '2 weekend sessions',
        xp: 400,
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
      },
    ],
  },
];

function AchievementCard({ item, index }: { item: typeof ACHIEVEMENTS[0]['items'][0], index: number }) {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={styles.achievementCard}>
      <View style={styles.achievementHeader}>
        <Award size={24} color={colors.primary} />
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{item.xp} XP</Text>
        </View>
      </View>
      
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDescription}>{item.description}</Text>
      
      <View style={styles.requirementContainer}>
        <Text style={styles.requirementLabel}>Requirement</Text>
        <Text style={styles.requirementText}>{item.requirement}</Text>
      </View>
    </Animated.View>
  );
}

export default function AchievementsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1,250</Text>
          <Text style={styles.statLabel}>Total XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4/12</Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
      </View>

      {ACHIEVEMENTS.map((category, categoryIndex) => (
        <View key={category.category} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.category}</Text>
          <View style={styles.achievementsGrid}>
            {category.items.map((item, index) => (
              <AchievementCard
                key={item.id}
                item={item}
                index={categoryIndex * 2 + index}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  categoryContainer: {
    padding: spacing.lg,
  },
  categoryTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  achievementCard: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  xpBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  xpText: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  achievementTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  requirementContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 12,
  },
  requirementLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  requirementText: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
});