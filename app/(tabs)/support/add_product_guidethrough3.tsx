import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const MODELS = [
  {
    id: 'with-chiller',
    name: 'Ice Bath with Chiller',
    image: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/tubsingleherowhite.png',
  },
  {
    id: 'without-chiller',
    name: 'Ice Bath without Chiller',
    image: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/tubsingleherowhite.png',
  },
];

export default function GuideThrough3Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Model</Text>

      {MODELS.map((model, index) => (
        <Animated.View 
          key={model.id}
          entering={FadeInUp.delay(index * 100)}
          style={styles.modelCard}>
          <TouchableOpacity
            style={styles.modelButton}
            onPress={() => router.push('/support/add_product_guidethrough4')}>
            <Image
              source={{ uri: model.image }}
              style={styles.modelImage}
            />
            <View style={styles.modelInfo}>
              <Text style={styles.modelName}>{model.name}</Text>
              <ChevronRight size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: spacing.xxl * 2,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  modelCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  modelButton: {
    width: '100%',
  },
  modelImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: colors.background,
  },
  modelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  modelName: {
    ...typography.h3,
    color: colors.text,
  },
});