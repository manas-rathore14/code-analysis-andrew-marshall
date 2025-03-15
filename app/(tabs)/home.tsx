import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';
import { ChevronRight, Trophy, Clock, Thermometer, ChevronDown, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getStoredSessions } from './index';
import { useState, useEffect, useMemo } from 'react';
import { getAverageStats } from '@/utils/sessionStats';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import Animated, { FadeInRight } from 'react-native-reanimated';

const HERO_IMAGE = "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop";

type TimePeriod = 'week' | 'month' | 'year';

const RECENT_ACHIEVEMENTS = [
  {
    id: '1',
    title: 'Early Bird',
    description: 'Completed 3 morning sessions',
    date: '2 days ago',
    icon: '🌅',
  },
  {
    id: '2',
    title: 'Consistency King',
    description: 'Completed 5 sessions in a row',
    date: '4 days ago',
    icon: '👑',
  },
];

const UPCOMING_ACHIEVEMENTS = [
  {
    id: '3',
    title: 'Ice Master',
    description: '2 more sessions to unlock',
    progress: 0.8,
    icon: '❄️',
  },
  {
    id: '4',
    title: 'Weekend Warrior',
    description: '1 more weekend session to unlock',
    progress: 0.5,
    icon: '⚔️',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const { convertTemperature, temperatureUnit } = useTemperatureUnit();
  const [allSessions, setAllSessions] = useState(getStoredSessions());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSessions = getStoredSessions();
      if (currentSessions.length !== allSessions.length) {
        setAllSessions(currentSessions);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [allSessions.length]);

  const filteredSessions = useMemo(() => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 365,
    };
    
    const cutoff = new Date(now.getTime() - (periods[timePeriod] * 24 * 60 * 60 * 1000));
    return allSessions.filter(session => new Date(session.date) > cutoff);
  }, [allSessions, timePeriod]);

  const previousPeriodSessions = useMemo(() => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 365,
    };
    
    const currentPeriodStart = new Date(now.getTime() - (periods[timePeriod] * 24 * 60 * 60 * 1000));
    const previousPeriodStart = new Date(currentPeriodStart.getTime() - (periods[timePeriod] * 24 * 60 * 60 * 1000));
    
    return allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate > previousPeriodStart && sessionDate <= currentPeriodStart;
    });
  }, [allSessions, timePeriod]);

  const currentStats = useMemo(() => getAverageStats(filteredSessions), [filteredSessions]);
  const previousStats = useMemo(() => getAverageStats(previousPeriodSessions), [previousPeriodSessions]);

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getPercentageChangeColor = (change: number) => {
    return change > 0 ? colors.success : change < 0 ? colors.error : colors.textSecondary;
  };

  const sessionsChange = calculatePercentageChange(filteredSessions.length, previousPeriodSessions.length);
  const durationChange = calculatePercentageChange(
    parseInt(currentStats.avgDuration.split(':')[0]),
    parseInt(previousStats.avgDuration.split(':')[0])
  );
  const temperatureChange = calculatePercentageChange(currentStats.avgTemperature, previousStats.avgTemperature);

  const handleStartSession = () => {
    router.push('/index');
  };

  const periodLabels = {
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
  };

  const renderPercentageChange = (change: number) => {
    if (change === 0) return null;
    return (
      <Text style={[styles.changeText, { color: getPercentageChangeColor(change) }]}>
        {change > 0 ? '+' : ''}{change}%
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>John</Text>
      </View>

      <View style={styles.heroCard}>
        <Image 
          source={{ uri: HERO_IMAGE }}
          style={styles.heroImage}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Ready for today's challenge?</Text>
          <TouchableOpacity style={styles.heroButton} onPress={handleStartSession}>
            <Text style={styles.heroButtonText}>Start Session</Text>
            <ChevronRight size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.periodSelector}
        onPress={() => setShowPeriodModal(true)}>
        <View style={styles.periodButton}>
          <Text style={styles.periodText}>{periodLabels[timePeriod]}</Text>
          <ChevronDown size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Trophy size={24} color={colors.primary} />
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{filteredSessions.length}</Text>
            {renderPercentageChange(sessionsChange)}
          </View>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>

        <View style={styles.statCard}>
          <Clock size={24} color={colors.primary} />
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{currentStats.avgDuration}</Text>
            {renderPercentageChange(durationChange)}
          </View>
          <Text style={styles.statLabel}>Avg. Duration</Text>
        </View>

        <View style={styles.statCard}>
          <Thermometer size={24} color={colors.primary} />
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {currentStats.avgTemperature}°F
            </Text>
            {renderPercentageChange(temperatureChange)}
          </View>
          <Text style={styles.statLabel}>Avg. Temp</Text>
        </View>
      </View>

      <View style={styles.achievementsSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Award size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/goals/achievements')}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.subsectionTitle}>Recently Unlocked</Text>
          {RECENT_ACHIEVEMENTS.map((achievement, index) => (
            <Animated.View
              key={achievement.id}
              entering={FadeInRight.delay(index * 100)}
              style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              </View>
            </Animated.View>
          ))}

          <Text style={[styles.subsectionTitle, styles.upcomingTitle]}>
            Almost There
          </Text>
          {UPCOMING_ACHIEVEMENTS.map((achievement, index) => (
            <Animated.View
              key={achievement.id}
              entering={FadeInRight.delay((index + RECENT_ACHIEVEMENTS.length) * 100)}
              style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${achievement.progress * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      <Modal
        visible={showPeriodModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPeriodModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}>
          <View style={styles.modalContent}>
            {Object.entries(periodLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.modalOption,
                  key === timePeriod && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setTimePeriod(key as TimePeriod);
                  setShowPeriodModal(false);
                }}>
                <Text
                  style={[
                    styles.modalOptionText,
                    key === timePeriod && styles.modalOptionTextSelected,
                  ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  name: {
    ...typography.h1,
    color: colors.text,
  },
  heroCard: {
    margin: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  heroImage: {
    width: '100%',
    height: 200,
    opacity: 0.7,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.background,
    marginBottom: spacing.md,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 25,
  },
  heroButtonText: {
    ...typography.body,
    color: colors.background,
    marginRight: spacing.xs,
  },
  periodSelector: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.sm,
    borderRadius: 15,
    gap: spacing.xs,
  },
  periodText: {
    ...typography.body,
    color: colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statContent: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  changeText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.md,
    width: '80%',
    maxWidth: 300,
  },
  modalOption: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  modalOptionSelected: {
    backgroundColor: colors.primary + '20',
  },
  modalOptionText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  achievementsSection: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...typography.body,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  achievementsContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: spacing.lg,
  },
  subsectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  upcomingTitle: {
    marginTop: spacing.xl,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  achievementDate: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});