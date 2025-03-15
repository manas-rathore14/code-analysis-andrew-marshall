interface Session {
  duration: string;
  temperature: string;
  date: string;
}

export function getAverageStats(sessions: Session[]) {
  if (!sessions.length) {
    return {
      avgDuration: '0:00',
      avgTemperature: 41, // Default temperature in Fahrenheit
    };
  }

  // Calculate total duration in seconds
  const totalDuration = sessions.reduce((acc, session) => {
    const [mins, secs] = session.duration.split(':').map(Number);
    return acc + (mins * 60) + secs;
  }, 0);

  // Calculate average duration
  const avgSeconds = Math.round(totalDuration / sessions.length);
  const avgMins = Math.floor(avgSeconds / 60);
  const avgSecs = avgSeconds % 60;

  // Calculate average temperature (already in Fahrenheit)
  const totalTemp = sessions.reduce((acc, session) => {
    return acc + parseFloat(session.temperature);
  }, 0);

  return {
    avgDuration: `${avgMins}:${avgSecs.toString().padStart(2, '0')}`,
    avgTemperature: Math.round(totalTemp / sessions.length),
  };
}

export function getSessionStats(sessions: Session[], timePeriod: 'week' | 'month' | 'year') {
  const now = new Date();
  const periods = {
    week: 7,
    month: 30,
    year: 365,
  };

  const cutoff = new Date(now.getTime() - (periods[timePeriod] * 24 * 60 * 60 * 1000));
  const currentPeriodSessions = sessions.filter(session => new Date(session.date) > cutoff);
  
  const previousPeriodStart = new Date(cutoff.getTime() - (periods[timePeriod] * 24 * 60 * 60 * 1000));
  const previousPeriodSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate > previousPeriodStart && sessionDate <= cutoff;
  });

  return {
    current: getAverageStats(currentPeriodSessions),
    previous: getAverageStats(previousPeriodSessions),
    totalSessions: currentPeriodSessions.length,
    previousSessions: previousPeriodSessions.length,
  };
}