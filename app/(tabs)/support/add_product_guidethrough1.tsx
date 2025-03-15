import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function GuideThrough1Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(100)} style={styles.content}>
        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>
          We'll help you set up your Primal product and unlock its full potential
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/support/add_product_guidethrough2')}>
          <Text style={styles.buttonText}>Continue</Text>
          <ChevronRight size={24} color={colors.background} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: spacing.xxl * 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 15,
    gap: spacing.sm,
  },
  buttonText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
});