import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { Plus, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SupportScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(100)}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.heroImage}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.textContainer}>
          <Text style={styles.title}>Control Your Products</Text>
          <Text style={styles.subtitle}>
            Add your Primal products here to unlock a range of new app features
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/support/add_product_guidethrough1')}>
            <Plus size={24} color={colors.background} />
            <Text style={styles.primaryButtonText}>Add a Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {}}>
            <ShoppingBag size={24} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Purchase A Primal Ice Bath</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl * 2,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 15,
    gap: spacing.sm,
  },
  primaryButtonText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    backgroundColor: colors.backgroundSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 15,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
});