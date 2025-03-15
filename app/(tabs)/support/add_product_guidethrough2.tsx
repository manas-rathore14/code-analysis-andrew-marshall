import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function GuideThrough2Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Product</Text>

      <Animated.View entering={FadeInUp.delay(100)} style={styles.productCard}>
        <TouchableOpacity
          style={styles.productButton}
          onPress={() => router.push('/support/add_product_guidethrough3')}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/stackblitz/bolt/main/assets/TubFinaleDifferentColorFilter.png' }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Primal Health Inflatable Ice Bath</Text>
            <ChevronRight size={24} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
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
  productCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    overflow: 'hidden',
  },
  productButton: {
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: colors.background,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  productName: {
    ...typography.h3,
    color: colors.text,
  },
});