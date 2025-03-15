import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { Award } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface AchievementCardProps {
  title: string;
  subtitle: string;
  delay?: number;
}

export function AchievementCard({ title, subtitle, delay = 0 }: AchievementCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay)}
      style={styles.container}>
      <Award size={20} color={colors.primary} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    marginLeft: spacing.md,
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});