import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { CircularProgressRing } from './CircularProgressRing';
import { Brain, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface GoalCardProps {
  title: string;
  target: string;
  progress: number;
  message?: string;
  isAIRecommendation?: boolean;
  onPress?: () => void;
  onAdopt?: () => void;
}

export function GoalCard({
  title,
  target,
  progress,
  message,
  isAIRecommendation,
  onPress,
  onAdopt,
}: GoalCardProps) {
  return (
    <Animated.View
      entering={FadeInRight}
      style={[
        styles.container,
        isAIRecommendation && styles.aiContainer,
      ]}>
      {isAIRecommendation && (
        <View style={styles.aiIcon}>
          <Brain size={20} color={colors.primary} />
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onPress && (
          <TouchableOpacity onPress={onPress}>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <CircularProgressRing
          progress={progress}
          size={120}
          strokeWidth={12}>
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </CircularProgressRing>

        <View style={styles.details}>
          <Text style={styles.target}>{target}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>

      {isAIRecommendation && onAdopt && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.adoptButton}
            onPress={onAdopt}>
            <Text style={styles.adoptButtonText}>Adopt Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.learnButton}>
            <Text style={styles.learnButtonText}>Learn More</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aiContainer: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  details: {
    flex: 1,
  },
  target: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.primary,
    fontStyle: 'italic',
  },
  progressText: {
    ...typography.h2,
    color: colors.primary,
    fontFamily: 'Inter-Bold',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  adoptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  adoptButtonText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
  learnButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  learnButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
});