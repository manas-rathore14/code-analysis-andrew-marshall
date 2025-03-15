import { Stack } from 'expo-router';

export default function InstallInstructionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="step1" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="step4" />
      <Stack.Screen name="step5" />
      <Stack.Screen name="step6" />
      <Stack.Screen name="step7" />
      <Stack.Screen name="step8" />
      <Stack.Screen name="step9" />
      <Stack.Screen name="step10" />
      <Stack.Screen name="step11" />
    </Stack>
  );
}