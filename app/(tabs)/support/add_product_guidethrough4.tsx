import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GuideThrough4Screen() {
  const router = useRouter();
  const [productName, setProductName] = useState('');

  const handleContinue = async () => {
    if (productName.trim()) {
      try {
        await AsyncStorage.setItem('productName', productName.trim());
        router.push('/support/setup_instructions');
      } catch (error) {
        console.error('Error saving product name:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.delay(100)} style={styles.content}>
        <Text style={styles.title}>Name Your Product</Text>
        <Text style={styles.subtitle}>
          Give your ice bath a unique name to easily identify it in the app
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={productName}
          onChangeText={setProductName}
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={[
            styles.button,
            !productName.trim() && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!productName.trim()}>
          <Text style={styles.buttonText}>Continue</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 15,
    padding: spacing.lg,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.body,
    color: colors.background,
    fontFamily: 'Inter-SemiBold',
  },
});