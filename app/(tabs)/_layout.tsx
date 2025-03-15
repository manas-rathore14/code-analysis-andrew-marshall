import { Tabs } from 'expo-router';
import { Activity, Target, CircleHelp as HelpCircle, Chrome as Home } from 'lucide-react-native';
import { StyleSheet, Platform, Image, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export default function TabLayout() {
  const bottomPadding = Platform.OS === 'ios' ? 20 : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + bottomPadding,
          paddingBottom: 8 + bottomPadding,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Start Session',
          tabBarIcon: () => (
            <View style={styles.centerTabContainer}>
              <View style={styles.logoContainer}>
                <Image 
                  source={{ uri: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/bolt-logo.png' }}
                  style={styles.logo}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, size }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, size }) => (
            <HelpCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  centerTabContainer: {
    alignItems: 'center',
    height: 48,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    position: 'absolute',
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 28,
    height: 28,
    tintColor: '#00A3FF',
  },
});