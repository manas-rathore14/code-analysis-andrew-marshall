import { Stack } from 'expo-router';

export default function SupportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="guide" />
      <Stack.Screen name="install_instructions" />
      <Stack.Screen name="setup_instructions" />
      <Stack.Screen name="connect_to_wifi" />
    </Stack>
  );
}