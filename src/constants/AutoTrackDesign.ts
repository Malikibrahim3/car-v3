/**
 * AutoTrack Design System
 * 
 * Premium automotive-inspired design with Apple-quality polish.
 * This is NOT a wireframe - it's a rich, branded experience.
 */

import { Platform, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// BRAND COLORS - AutoTrack Identity
// ============================================================================

export const Colors = {
  // Brand Primary - Teal (Trust, Technology, Premium)
  brand: '#0F81A3',
  brandDark: '#0A5A75',
  brandLight: '#B8F9E9',
  brandGlow: 'rgba(15, 129, 163, 0.4)',
  
  // Brand Secondary - Crimson (Automotive, Passion, Alerts)
  accent: '#A50010',
  accentDark: '#7A000C',
  accentLight: '#FFE5E8',
  
  // Semantic - Traffic Light System
  positive: '#00C853',      // Bright green - winning
  positiveGlow: 'rgba(0, 200, 83, 0.3)',
  positiveBg: 'rgba(0, 200, 83, 0.12)',
  
  negative: '#FF3D00',      // Bright red-orange - losing
  negativeGlow: 'rgba(255, 61, 0, 0.3)',
  negativeBg: 'rgba(255, 61, 0, 0.12)',
  
  warning: '#FFB300',       // Amber - caution
  warningGlow: 'rgba(255, 179, 0, 0.3)',
  
  // Backgrounds - Rich, not flat
  background: '#F8FAFB',    // Subtle cool tint
  backgroundDark: '#0D1117', // Rich dark mode
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  
  // Text
  text: '#1A1D21',
  textSecondary: '#5C6370',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Structural
  border: '#E5E9ED',
  borderLight: '#F0F3F5',
  divider: '#EBEEF1',
  
  // Gradients (as arrays for LinearGradient)
  gradientBrand: ['#0F81A3', '#0A5A75'],
  gradientBrandLight: ['#B8F9E9', '#7EECD3'],
  gradientPositive: ['#00E676', '#00C853'],
  gradientNegative: ['#FF5722', '#FF3D00'],
  gradientDark: ['#1A1D21', '#0D1117'],
  gradientCard: ['#FFFFFF', '#F8FAFB'],
  gradientHero: ['#0F81A3', '#065A75', '#043D50'],
} as const;

// ============================================================================
// TYPOGRAPHY - Bold and Confident
// ============================================================================

export const Typography = {
  // Hero numbers - impactful but not overwhelming
  hero: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1.5,
    lineHeight: 56,
  },
  
  // Large display numbers
  display: {
    fontSize: 36,
    fontWeight: '600' as const,
    letterSpacing: -1,
    lineHeight: 44,
  },
  
  // Screen titles
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 41,
  },
  
  // Section headers
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 28,
  },
  
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
    lineHeight: 25,
  },
  
  // Body text
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 21,
  },
  
  subheadline: {
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 18,
  },
  
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  
  micro: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 12,
  },
} as const;

// ============================================================================
// SPACING - Generous and Breathable
// ============================================================================

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
} as const;

// ============================================================================
// RADIUS - Refined and Subtle (Linear-style)
// ============================================================================

export const Radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999,
} as const;

// ============================================================================
// SHADOWS - Subtle and Refined (Linear-style)
// ============================================================================

export const Shadows = {
  // Subtle elevation - primary shadow for most cards
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  
  // Standard card - slightly more presence
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  
  // Elevated card - for modals and overlays
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Hero elements - still subtle
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  
  // Brand glow - reduced, subtle hint
  brandGlow: {
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Positive glow - subtle success hint
  positiveGlow: {
    shadowColor: Colors.positive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  
  // Negative glow - subtle warning hint
  negativeGlow: {
    shadowColor: Colors.negative,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  
  // Floating elements (FAB, modals) - still restrained
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// ============================================================================
// HAPTICS - Tactile Feedback
// ============================================================================

export const haptic = {
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },
  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },
  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },
  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  },
  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },
  warning: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },
  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },
};

// ============================================================================
// ANIMATIONS - Smooth and Purposeful
// ============================================================================

export const Animation = {
  fast: 150,
  normal: 200,
  slow: 300,
  spring: {
    damping: 15,
    stiffness: 150,
  },
} as const;

// ============================================================================
// ICON SIZES - Standardized (18/22/26 only)
// ============================================================================

export const IconSizes = {
  sm: 18,    // Small inline icons, badges
  md: 22,    // Standard icons, tab bar
  lg: 26,    // Emphasized icons, headers
  xl: 32,    // Hero icons
} as const;

// ============================================================================
// LAYOUT
// ============================================================================

export const Layout = {
  screenWidth: SCREEN_WIDTH,
  maxContentWidth: 428, // iPhone 14 Pro Max
  cardPadding: Spacing.lg,
  screenPadding: Spacing.base,
} as const;

// ============================================================================
// EXPORT
// ============================================================================

export const Design = {
  Colors,
  Typography,
  Spacing,
  Radius,
  Shadows,
  haptic,
  Animation,
  Layout,
  IconSizes,
};

export default Design;
