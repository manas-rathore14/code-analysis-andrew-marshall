import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { Wifi, Wrench, ShoppingCart, CircleAlert as AlertCircle, Settings, Bell, Check, MoveVertical as MoreVertical } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const SETUP_SECTIONS = [
  {
    id: 'install',
    title: 'Install Instructions',
    description: 'Step-by-step product installation',
    icon: Settings,
    route: '/support/install_instructions',
  },
  {
    id: 'wifi',
    title: 'Connect to WiFi',
    description: 'Set up device connectivity',
    icon: Wifi,
    route: '/support/connect_to_wifi',
  },
  {
    id: 'notifications',
    title: 'Set Up Notifications',
    description: 'Configure maintenance reminders',
    icon: Bell,
  },
];

export default function SetupInstructionsScreen() {
  const router = useRouter();
  const [productName, setProductName] = useState('My Ice Bath');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const pendingTasks = SETUP_SECTIONS.length - completedTasks.length;

  useEffect(() => {
    loadProductName();
    loadCompletedTasks();
  }, []);

  const loadProductName = async () => {
    try {
      const name = await AsyncStorage.getItem('productName');
      if (name) setProductName(name);
    } catch (error) {
      console.error('Error loading product name:', error);
    }
  };

  const loadCompletedTasks = async () => {
    try {
      const tasks = await AsyncStorage.getItem('completedTasks');
      if (tasks) setCompletedTasks(JSON.parse(tasks));
    } catch (error) {
      console.error('Error loading completed tasks:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Setup Progress</Text>

        {/* Product Card */}
        <Animated.View 
          entering={FadeInUp.delay(100)}
          style={styles.productCard}>
          <View style={styles.productHeader}>
            <Image
              source={{ uri: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/TubFinaleDifferentColorFilter.png' }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <View style={styles.productTitleRow}>
                <Text style={styles.productName}>{productName}</Text>
                <TouchableOpacity>
                  <MoreVertical size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.connectionStatus}>
                <Wifi size={16} color={colors.error} />
                <Text style={styles.statusText}>Not connected</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Tasks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Setup Tasks</Text>
          {pendingTasks > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingTasks}</Text>
            </View>
          )}
        </View>

        {SETUP_SECTIONS.map((section, index) => (
          <Animated.View
            key={section.id}
            entering={FadeInUp.delay(200 + index * 100)}
            style={styles.taskCard}>
            <TouchableOpacity 
              style={styles.taskButton}
              onPress={() => section.route && router.push(section.route)}>
              <View style={styles.taskContent}>
                <View style={[
                  styles.taskIcon,
                  completedTasks.includes(section.id) && styles.taskIconCompleted
                ]}>
                  {completedTasks.includes(section.id) ? (
                    <Check size={24} color={colors.background} />
                  ) : (
                    <section.icon size={24} color={colors.primary} />
                  )}
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{section.title}</Text>
                  <Text style={styles.taskDescription}>{section.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* More Options Section */}
        <Text style={styles.sectionTitle}>More Options</Text>
        <View style={styles.optionsContainer}>
          <Animated.View 
            entering={FadeInUp.delay(500)}
            style={styles.optionCard}>
            <TouchableOpacity style={styles.optionButton}>
              <Wrench size={24} color={colors.text} />
              <Text style={styles.optionText}>Maintenance</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View 
            entering={FadeInUp.delay(600)}
            style={styles.optionCard}>
            <TouchableOpacity style={styles.optionButton}>
              <ShoppingCart size={24} color={colors.text} />
              <Text style={styles.optionText}>Supplies</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Support Note */}
        <Animated.View 
          entering={FadeInUp.delay(700)}
          style={styles.supportNote}>
          <AlertCircle size={20} color={colors.primary} />
          <Text style={styles.supportText}>
            Need help? Our support team is available 24/7 to assist you with setup.
          </Text>
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
    padding: spacing.lg,
    paddingTop: spacing.xxl * 2,
  },
  pageTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  productCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background,
    resizeMode: 'contain',
  },
  productInfo: {
    flex: 1,
  },
  productTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  productName: {
    ...typography.h3,
    color: colors.text,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.error,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    ...typography.caption,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
  taskCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  taskButton: {
    padding: spacing.lg,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  taskIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskIconCompleted: {
    backgroundColor: colors.success,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing.xs,
  },
  taskDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  optionCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
  },
  optionButton: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
  },
  supportNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary + '10',
    padding: spacing.lg,
    borderRadius: 16,
  },
  supportText: {
    ...typography.caption,
    color: colors.primary,
    flex: 1,
  },
});