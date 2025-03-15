import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { ChevronLeft, CirclePlay as PlayCircle } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const GUIDES = {
  'ice-bath-setup': {
    title: 'Setting Up Your Ice Bath',
    sections: [
      {
        title: 'Unboxing & Initial Setup',
        content: `Begin by carefully unpacking your ice bath components. You'll find:
• The main tub body
• Temperature control unit
• Filtration system
• Essential accessories

Inspect all parts for any damage during shipping. Lay out the components in a clean, dry area.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '3:45',
          title: 'Unboxing Your Ice Bath',
        },
      },
      {
        title: 'Location & Surface Preparation',
        content: `Choose a level surface that can support the filled weight:
• Ensure proper drainage nearby
• Allow space for maintenance access
• Consider privacy and convenience
• Check electrical outlet accessibility

Use a level to verify the surface is flat. Clean the area thoroughly.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '2:30',
          title: 'Choosing the Perfect Location',
        },
      },
      {
        title: 'Water Fill & Temperature',
        content: `Follow these steps for the initial fill:
1. Connect all plumbing fixtures
2. Begin filling with clean water
3. Add initial treatment chemicals
4. Start the filtration system
5. Set desired temperature

Monitor the first fill closely for any leaks or issues.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '4:15',
          title: 'First Fill Guide',
        },
      },
    ],
  },
  'temperature-management': {
    title: 'Temperature Management',
    sections: [
      {
        title: 'Understanding Temperature Control',
        content: `Your ice bath's temperature system consists of:
• Digital control panel
• Temperature sensors
• Cooling system
• Circulation pump

Learn how these components work together for optimal performance.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '3:20',
          title: 'Temperature System Overview',
        },
      },
      {
        title: 'Setting & Maintaining Temperature',
        content: `Follow these steps for consistent temperature:
1. Set your target temperature
2. Allow system to reach temperature
3. Monitor readings regularly
4. Adjust based on conditions

Remember: External factors can affect temperature stability.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '5:00',
          title: 'Perfect Temperature Guide',
        },
      },
    ],
  },
  'maintenance-cleaning': {
    title: 'Maintenance & Cleaning',
    sections: [
      {
        title: 'Daily Maintenance',
        content: `Essential daily tasks:
• Check water clarity
• Test chemical levels
• Remove any debris
• Record temperature readings
• Inspect for any issues

These simple steps prevent most common problems.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '2:45',
          title: 'Daily Maintenance Routine',
        },
      },
      {
        title: 'Weekly Cleaning',
        content: `Weekly maintenance checklist:
1. Clean filter
2. Test and adjust water chemistry
3. Wipe down surfaces
4. Check equipment function
5. Document maintenance

Regular cleaning extends equipment life.`,
        video: {
          thumbnail: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=2070&auto=format&fit=crop',
          duration: '4:30',
          title: 'Weekly Cleaning Guide',
        },
      },
    ],
  },
};

export default function GuideScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const guide = GUIDES[id as keyof typeof GUIDES];

  if (!guide) {
    return (
      <View style={styles.container}>
        <Text>Guide not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{guide.title}</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        {guide.sections.map((section, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(index * 100)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <TouchableOpacity style={styles.videoCard}>
              <Image
                source={{ uri: section.video.thumbnail }}
                style={styles.thumbnail}
              />
              <View style={styles.playButton}>
                <PlayCircle size={48} color={colors.background} />
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{section.video.title}</Text>
                <Text style={styles.videoDuration}>{section.video.duration}</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.content}>{section.content}</Text>
          </Animated.View>
        ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? spacing.xxl * 2 : spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  videoCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.primary,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: spacing.md,
  },
  videoTitle: {
    ...typography.body,
    color: colors.text,
    fontFamily: 'Inter-SemiBold',
    marginBottom: spacing.xs,
  },
  videoDuration: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
});