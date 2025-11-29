import React from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CarProvider } from '../src/context/CarContext';
import { AuthProvider } from '../src/context/AuthContext';
import { AchievementProvider } from '../src/context/AchievementContext';
import { ThemeProvider, useThemeMode } from '../src/context/ThemeContext';
import { lightTheme, darkTheme } from '../src/theme/theme';
import { PALETTE } from '../src/constants/DesignSystem';
import Toast from 'react-native-toast-message';

// Import global CSS for web
if (Platform.OS === 'web') {
  require('../app.css');
}

// Auto-enable test mode in development (web only)
if (Platform.OS === 'web') {
  require('../src/utils/testAuth');
}

function AppContent() {
  const { isDark } = useThemeMode();
  
  // Force light mode for now
  const theme = lightTheme;
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <CarProvider>
            <AchievementProvider>
              {/* Dark Status Bar Text for Light Background */}
              <StatusBar style="dark" />
              {/* Solid Porcelain Background - Force Light Mode */}
              <View style={{ flex: 1, backgroundColor: PALETTE.background }}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: PALETTE.background },
                    animation: 'fade',
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(app)" />
                  <Stack.Screen name="(tabs)" />
                </Stack>
              </View>
              <Toast />
            </AchievementProvider>
          </CarProvider>
        </AuthProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
