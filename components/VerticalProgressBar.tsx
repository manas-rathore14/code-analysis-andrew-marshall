import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface VerticalProgressBarProps {
  progress: number;
  index: number;
  total: number;
}

export function VerticalProgressBar({ progress, index, total }: VerticalProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const height = withTiming(interpolate(progress, [0, 1], [0, 100]), { duration: 300 });
    return {
      height: `${height}%`,
    };
  });

  return (
    <View style={[styles.container, { transform: [{ rotate: `${(index / total) * 360}deg` }] }]}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 3,
    height: '100%',
    overflow: 'hidden',
    borderRadius: 1.5,
    backgroundColor: colors.backgroundSecondary,
    transform: [{ translateY: -150 }], // Half of the container height
  },
  progress: {
    width: '100%',
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 0,
    borderRadius: 1.5,
  },
});