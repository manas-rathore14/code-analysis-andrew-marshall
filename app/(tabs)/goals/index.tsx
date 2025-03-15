import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { GoalCard } from '@/components/GoalCard';
import { AchievementCard } from '@/components/AchievementCard';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { GoalSelector } from '@/components/GoalSelector';

export default function GoalsScreen() {
  const router = useRouter();
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(5);
  const [recommendedGoal, setRecommendedGoal] = useState(6);

  const handleSetGoal = (minutes: number) => {
    setCurrentGoal(minutes);
    setShowGoalSelector(false);
  };

  const handleAdoptRecommendation = () => {
    setCurrentGoal(recommendedGoal);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Your Progress</Text>
        <Text style={styles.title}>Goals</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={() => setShowGoalSelector(true)}>
          <GoalCard
            title="Your Current Time Goal"
            target={`${currentGoal} Minutes, 5 Times a Week`}
            progress={0.4}
            message="Tap to adjust your goal"
            onPress={() => setShowGoalSelector(true)}
          />
        </TouchableOpacity>

        <GoalCard
          title="Recommended Time Goal"
          target={`${recommendedGoal} Minutes per Session`}
          progress={0}
          message="Based on your recent progress, we suggest increasing your session duration."
          isAIRecommendation
          onAdopt={handleAdoptRecommendation}
        />

        <Text style={styles.sectionTitle}>Unlock Your Next Achievement</Text>
        
        <GoalCard
          title="Try an 8-Minute Session"
          target="Complete one 8-minute session"
          progress={0.25}
        />

        <GoalCard
          title="Weekend Warrior"
          target="Complete sessions on Saturday and Sunday"
          progress={0.5}
        />

        <Text style={styles.sectionTitle}>Earned Achievements</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/goals/achievements')}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.achievementsContainer}>
          <AchievementCard
            title="Almost There!"
            subtitle="2 more sessions to unlock 'Ice Master'"
            delay={100}
          />

          <AchievementCard
            title="Close to Endurance II"
            subtitle="1 minute away from 10-minute milestone"
            delay={200}
          />

          <AchievementCard
            title="Weekend Warrior Progress"
            subtitle="Complete 1 more weekend session"
            delay={300}
          />
        </View>
      </View>

      <GoalSelector
        visible={showGoalSelector}
        currentValue={currentGoal}
        onClose={() => setShowGoalSelector(false)}
        onSetGoal={handleSetGoal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    ...typography.body,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  achievementsContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: spacing.md,
  },
});