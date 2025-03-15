import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { Play, Pause, Save, Flag } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { CircularProgress } from '@/components/CircularProgress';
import { MilestoneIndicator } from '@/components/MilestoneIndicator';
import { useRouter } from 'expo-router';

const GOAL_TIME = 180; // 3 minutes (mock goal)

// Create a global store for sessions
let sessions = [];

export function getStoredSessions() {
  return sessions;
}

export default function TimerScreen() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [milestone, setMilestone] = useState<{ message: string; type: 'info' | 'success' } | null>(null);
  const [showLogButton, setShowLogButton] = useState(false);

  // Mock health data (to be replaced with actual Apple Watch integration)
  const [healthData] = useState({
    heartRate: 72,
    temperature: 41, // Starting temperature in Fahrenheit
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          
          if (newTime === GOAL_TIME) {
            setMilestone({
              message: '🎯 Goal Achieved!',
              type: 'success'
            });
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (milestone) {
      const timeout = setTimeout(() => {
        setMilestone(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [milestone]);

  const toggleTimer = () => {
    if (isRunning) {
      setShowLogButton(true);
    }
    setIsRunning(!isRunning);
  };

  const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogSession = () => {
    const duration = formatDuration(time);
    
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration,
      temperature: healthData.temperature.toString(),
      heartRate: `${healthData.heartRate} bpm`,
    };

    sessions = [newSession, ...sessions];
    setTime(0);
    setShowLogButton(false);
    router.push('/history');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <CircularProgress
            progress={Math.min(time / GOAL_TIME, 1)}
            size={300}
            strokeWidth={12}
            duration={800}>
            <View style={styles.timeDisplay}>
              <Text style={styles.timerText}>{formatDuration(time)}</Text>
              <View style={styles.goalContainer}>
                <Flag size={16} color={colors.textSecondary} />
                <Text style={styles.goalText}>{formatDuration(GOAL_TIME)}</Text>
              </View>
            </View>
          </CircularProgress>

          {milestone && (
            <MilestoneIndicator
              message={milestone.message}
              type={milestone.type}
            />
          )}
        </View>

        <View style={styles.healthMetrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Heart Rate</Text>
            <Text style={styles.metricValue}>{healthData.heartRate}<Text style={styles.metricUnit}> bpm</Text></Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Temperature</Text>
            <Text style={styles.metricValue}>
              {healthData.temperature}
              <Text style={styles.metricUnit}>°F</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {showLogButton && !isRunning && (
          <TouchableOpacity
            style={[styles.mainButton, styles.logButton]}
            onPress={handleLogSession}>
            <Save color={colors.background} size={32} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={toggleTimer}>
          {isRunning ? (
            <Pause color={colors.background} size={32} />
          ) : (
            <Play color={colors.background} size={32} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 2.5 : spacing.xxl * 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timerText: {
    ...typography.h1,
    fontSize: 56,
    color: colors.primary,
    fontFamily: 'Inter-Bold',
    lineHeight: 64,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  goalText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  healthMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    width: '100%',
    paddingHorizontal: spacing.xl * 1.5,
    justifyContent: 'center',
  },
  metric: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xl * 1.5,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  metricValue: {
    ...typography.h2,
    color: colors.text,
    fontSize: 32,
  },
  metricUnit: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 16,
  },
});