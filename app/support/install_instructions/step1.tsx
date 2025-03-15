import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function Step1Screen() {
  const router = useRouter();
  const currentStep = 1;
  const totalSteps = 11;

  const navigateToNextStep = () => {
    router.push('/support/install_instructions/step2');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>{currentStep} of {totalSteps}</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(100)}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/TubFinaleDifferentColorFilter.png' }}
            style={styles.stepImage}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)}>
          <Text style={styles.title}>Location Requirements</Text>
          <Text style={styles.description}>
            Choose a level surface that can support the filled weight of your ice bath. The location should have proper drainage nearby and enough space for maintenance access. Consider privacy and convenience when selecting the perfect spot.
          </Text>
          <Text style={styles.description}>
            Important considerations:
            {'\n'}- Ensure the surface is completely level
            {'\n'}- Allow at least 2 feet of clearance on all sides
            {'\n'}- Verify electrical outlet accessibility
            {'\n'}- Check for proper drainage options
            {'\n'}- Consider privacy needs
          </Text>
        </Animated.View>

        <View style={styles.navigation}>
          <View style={styles.navigationButton} />
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={navigateToNextStep}>
            <Text style={styles.navigationText}>Next</Text>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    ...typography.body,
    color: colors.textSecondary,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    padding: spacing.lg,
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
    resizeMode: 'contain',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 100,
  },
  navigationText: {
    ...typography.body,
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
});