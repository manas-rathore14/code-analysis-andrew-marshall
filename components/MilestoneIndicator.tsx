import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';
import Animated, { 
  FadeInUp, 
  FadeOutDown,
  withSpring,
  withSequence,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface MilestoneIndicatorProps {
  message: string;
  type?: 'success' | 'info';
}

export function MilestoneIndicator({ 
  message, 
  type = 'info' 
}: MilestoneIndicatorProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.1),
      withTiming(1, { duration: 200 })
    );
  }, [message]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeInUp}
      exiting={FadeOutDown}
      style={[
        styles.container,
        type === 'success' ? styles.successContainer : styles.infoContainer,
        animatedStyle,
      ]}>
      <Text style={[
        styles.text,
        type === 'success' ? styles.successText : styles.infoText,
      ]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  infoContainer: {
    backgroundColor: colors.primary + '20',
  },
  successContainer: {
    backgroundColor: colors.success + '20',
  },
  text: {
    ...typography.caption,
    textAlign: 'center',
  },
  infoText: {
    color: colors.primary,
  },
  successText: {
    color: colors.success,
  },
});