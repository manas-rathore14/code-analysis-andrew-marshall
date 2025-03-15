import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { ChevronLeft, MoveVertical as MoreVertical, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INSTALLATION_STEPS = [
  { id: 1, title: 'Location Requirements' },
  { id: 2, title: 'Unboxing the product' },
  { id: 3, title: 'Placing the chiller' },
  { id: 4, title: 'Connecting connection B' },
  { id: 5, title: 'Connecting connection A' },
  { id: 6, title: 'Fill the ice bath' },
  { id: 7, title: 'Plug in the chiller' },
  { id: 8, title: 'Understanding the chiller controls' },
  { id: 9, title: 'Setting the temperature' },
  { id: 10, title: 'Powering on the chiller' },
  { id: 11, title: 'Water maintenance' },
];

export default function InstallInstructionsScreen() {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [isInstallComplete, setIsInstallComplete] = useState(false);

  useEffect(() => {
    checkInstallStatus();
  }, []);

  const checkInstallStatus = async () => {
    try {
      const tasks = await AsyncStorage.getItem('completedTasks');
      if (tasks) {
        const completedTasks = JSON.parse(tasks);
        setIsInstallComplete(completedTasks.includes('install'));
      }
    } catch (error) {
      console.error('Error checking install status:', error);
    }
  };

  const handleMarkAsFinished = async () => {
    try {
      const tasks = await AsyncStorage.getItem('completedTasks');
      const completedTasks = tasks ? JSON.parse(tasks) : [];
      if (!completedTasks.includes('install')) {
        completedTasks.push('install');
        await AsyncStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        setIsInstallComplete(true);
      }
      router.back();
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  const navigateToStep = (stepId: number) => {
    router.push(`/support/install_instructions/step${stepId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setShowOptions(!showOptions)}>
          <MoreVertical size={24} color={colors.text} />
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleMarkAsFinished}>
              <Check size={20} color={colors.success} />
              <Text style={styles.optionText}>Mark as finished</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                router.back();
              }}>
              <Text style={[styles.optionText, { color: colors.error }]}>
                Exit without finishing
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Install Instructions</Text>
        <Text style={styles.subtitle}>
          Follow these steps to properly set up your ice bath and ensure optimal performance
        </Text>

        <Image
          source={{ uri: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/TubFinaleDifferentColorFilter.png' }}
          style={styles.productImage}
        />

        <Text style={styles.sectionTitle}>Overview</Text>
        {INSTALLATION_STEPS.map((step, index) => (
          <Animated.View
            key={step.id}
            entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity
              style={styles.stepCard}
              onPress={() => navigateToStep(step.id)}>
              <View style={[
                styles.stepNumber,
                isInstallComplete && styles.stepNumberCompleted
              ]}>
                {isInstallComplete ? (
                  <Check size={16} color={colors.background} />
                ) : (
                  <Text style={styles.stepNumberText}>{step.id}</Text>
                )}
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <TouchableOpacity
          style={styles.beginButton}
          onPress={() => router.push('/support/install_instructions/step1')}>
          <Text style={styles.beginButtonText}>Begin Install</Text>
        </TouchableOpacity>
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
  optionsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsMenu: {
    position: 'absolute',
    top: spacing.xxl * 2 + 50,
    right: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.sm,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
    resizeMode: 'contain',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberCompleted: {
    backgroundColor: colors.success,
  },
  stepNumberText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
  stepTitle: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  beginButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  beginButtonText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
});