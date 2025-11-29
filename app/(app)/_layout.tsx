import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="car-detail" />
      <Stack.Screen name="edit-car" />
    </Stack>
  );
}
