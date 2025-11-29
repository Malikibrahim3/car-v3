/**
 * Tab Layout - Premium AutoTrack Experience
 * 
 * Glass morphism tab bar with:
 * - Floating center button for Garage
 * - Glowing active states
 * - Smooth animations
 */

import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { View, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Car, Calculator, Bell, BarChart3 } from 'lucide-react-native';
import { Colors, Shadows, Radius, IconSizes } from '@/src/constants/AutoTrackDesign';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <BlurView 
              intensity={80} 
              tint="light" 
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.tabBarBorder} />
          </View>
        ),
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Home size={IconSizes.md} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="tools" 
        options={{ 
          title: 'Estimator',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Calculator size={IconSizes.md} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="garage" 
        options={{ 
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButtonContainer}>
              <View style={[styles.centerButtonShadow, focused && styles.centerButtonShadowActive]}>
                <LinearGradient
                  colors={focused ? Colors.gradientBrand : [Colors.surface, Colors.surface]}
                  style={styles.centerButton}
                >
                  <Car 
                    size={IconSizes.lg} 
                    color={focused ? 'white' : Colors.brand} 
                    strokeWidth={2.5}
                  />
                </LinearGradient>
              </View>
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="activity" 
        options={{ 
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Bell size={IconSizes.md} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="market" 
        options={{ 
          title: 'Market',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <BarChart3 size={IconSizes.md} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          href: null,
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'hidden',
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
  },
  iconContainer: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  iconContainerActive: {
    backgroundColor: `${Colors.brand}12`,
  },
  centerButtonContainer: {
    position: 'relative',
    top: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonShadow: {
    ...Shadows.lg,
  },
  centerButtonShadowActive: {
    ...Shadows.brandGlow,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
});
