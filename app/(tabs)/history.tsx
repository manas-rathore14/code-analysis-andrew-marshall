import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';
import { Calendar, Clock, Thermometer, ChevronDown, Trophy, Timer, Cuboid as Cube, Flame } from 'lucide-react-native';
import { getStoredSessions } from './index';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useMemo } from 'react';
import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';
import Animated, { FadeInUp } from 'react-native-reanimated';

type TimePeriod = 'week' | 'month' | 'year';

const periodLabels = {
  week: 'This Week',
  month: 'This Month',
  year: 'This Year',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export default function ActivityScreen() {
  const [sessions, setSessions] = useState([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const { temperatureUnit } = useTemperatureUnit();

  useFocusEffect(
    useCallback(() => {
      setSessions(getStoredSessions());
    }, [])
  );

  const filteredSessions = useMemo(() => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 365,
    };
    
    const cutoff = new Date(now.getTime() - (periods[timePeriod] * 24 * 60 * 60 * 1000));
    return sessions.filter(session => new Date(session.date) > cutoff);
  }, [sessions, timePeriod]);

  const stats = useMemo(() => {
    // Calculate lifetime stats (not filtered by time period)
    const lifetimeMinutes = sessions.reduce((total, session) => {
      const [mins] = session.duration.split(':').map(Number);
      return total + mins;
    }, 0);

    // Calculate period-specific stats
    const totalSessions = filteredSessions.length;
    
    const durations = filteredSessions.map(session => {
      const [mins] = session.duration.split(':').map(Number);
      return mins;
    });

    const avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const longestDuration = durations.length > 0 
      ? Math.max(...durations)
      : 0;

    const totalMinutes = durations.reduce((a, b) => a + b, 0);

    // Calculate streak
    const maxStreak = timePeriod === 'week' ? 7 : timePeriod === 'month' ? 30 : 365;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < maxStreak; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const hasSession = filteredSessions.some(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === date.toDateString();
      });
      if (hasSession) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      lifetimeMinutes,
      totalSessions,
      avgDuration,
      longestDuration,
      totalMinutes,
      currentStreak,
    };
  }, [filteredSessions, sessions, timePeriod]);

  const StatCard = ({ icon: Icon, value, label, delay = 0 }) => (
    <Animated.View 
      entering={FadeInUp.delay(delay)}
      style={styles.statCard}>
      <Icon size={24} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Your ice bath journey</Text>
      </View>

      <View style={styles.lifetimeStats}>
        <Clock size={24} color={colors.primary} />
        <Text style={styles.lifetimeValue}>
          {formatDuration(stats.lifetimeMinutes)}
        </Text>
        <Text style={styles.lifetimeLabel}>Total Time in Ice</Text>
      </View>

      <TouchableOpacity
        style={styles.periodSelector}
        onPress={() => setShowPeriodModal(true)}>
        <View style={styles.periodButton}>
          <Text style={styles.periodText}>{periodLabels[timePeriod]}</Text>
          <ChevronDown size={20} color={colors.primary} />
        </View>
      </TouchableOpacity>

      <View style={styles.statsGrid}>
        <StatCard
          icon={Cube}
          value={stats.totalSessions}
          label="Total Ice Baths"
          delay={100}
        />
        <StatCard
          icon={Timer}
          value={`${stats.avgDuration}m`}
          label="Average Duration"
          delay={200}
        />
        <StatCard
          icon={Trophy}
          value={`${stats.longestDuration}m`}
          label="Longest Duration"
          delay={300}
        />
        <StatCard
          icon={Clock}
          value={formatDuration(stats.totalMinutes)}
          label="Total Time"
          delay={400}
        />
        <StatCard
          icon={Flame}
          value={stats.currentStreak}
          label="Current Streak"
          delay={500}
        />
      </View>

      <View style={styles.sessionsContainer}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {filteredSessions.map((session, index) => (
          <Animated.View
            key={session.id}
            entering={FadeInUp.delay(600 + index * 100)}
          >
            <TouchableOpacity style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.dateContainer}>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={styles.dateText}>{formatDate(session.date)}</Text>
                </View>
                <Text style={styles.timeText}>{formatTime(session.date)}</Text>
              </View>

              <View style={styles.sessionStats}>
                <View style={styles.stat}>
                  <Clock size={20} color={colors.textSecondary} />
                  <Text style={styles.statValue}>{session.duration}</Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.stat}>
                  <Thermometer size={20} color={colors.textSecondary} />
                  <Text style={styles.statValue}>
                    {Math.round(parseFloat(session.temperature))}°F
                  </Text>
                  <Text style={styles.statLabel}>Temperature</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  lifetimeStats: {
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  lifetimeValue: {
    ...typography.h1,
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  lifetimeLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  periodSelector: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sessionsContainer: {
    padding: spacing.lg,
  },
  sessionCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.body,
    color: colors.text,
  },
  timeText: {
    ...typography.caption,
    color: colors.primary,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
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
});