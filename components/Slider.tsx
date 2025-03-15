import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
}

export function Slider({
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
}: SliderProps) {
  const width = 300;
  const knobSize = 28;
  const trackHeight = 4;

  const progress = useSharedValue((value - minimumValue) / (maximumValue - minimumValue));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startProgress = progress.value;
    },
    onActive: (event, ctx) => {
      let newProgress = ctx.startProgress + event.translationX / width;
      newProgress = Math.min(Math.max(newProgress, 0), 1);
      progress.value = newProgress;

      const range = maximumValue - minimumValue;
      const rawValue = minimumValue + range * newProgress;
      const steppedValue = Math.round(rawValue / step) * step;
      onValueChange(steppedValue);
    },
    onEnd: () => {
      progress.value = withSpring(progress.value);
    },
  });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * width }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height: trackHeight }]}>
        <Animated.View style={[styles.progress, progressStyle]} />
      </View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.knob, { width: knobSize, height: knobSize }, knobStyle]} />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 2,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  knob: {
    position: 'absolute',
    backgroundColor: colors.primary,
    borderRadius: 14,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});