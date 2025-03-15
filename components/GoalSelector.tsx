import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/Slider';

interface GoalSelectorProps {
  visible: boolean;
  currentValue: number;
  onClose: () => void;
  onSetGoal: (minutes: number) => void;
}

export function GoalSelector({
  visible,
  currentValue,
  onClose,
  onSetGoal,
}: GoalSelectorProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(currentValue);
  const translateY = useSharedValue(500);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = withTiming(500);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleSetGoal = () => {
    onSetGoal(selectedMinutes);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Your Goal</Text>
            <Text style={styles.subtitle}>
              Choose your target session duration
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.timeDisplay}>
              {selectedMinutes} Minutes
            </Text>

            <Slider
              value={selectedMinutes}
              minimumValue={1}
              maximumValue={10}
              step={1}
              onValueChange={setSelectedMinutes}
            />

            <View style={styles.labels}>
              <Text style={styles.label}>1 min</Text>
              <Text style={styles.label}>10 min</Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.setButton}
              onPress={handleSetGoal}>
              <Text style={styles.setButtonText}>Set Goal</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  content: {
    marginBottom: spacing.xl,
  },
  timeDisplay: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
  setButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 15,
    alignItems: 'center',
  },
  setButtonText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
});