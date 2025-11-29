import { Dimensions, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SPACING } from './Spacing';
import { TYPOGRAPHY } from './Typography';

const { width } = Dimensions.get('window');

export const PALETTE = {
  // Core Surfaces - ClearScore authentic palette with depth
  background: '#EBF9FB', // Light teal background - 20% lighter
  surface: '#FFFFFF',    // Pure White - for elevated cards
  surfaceTeal: '#D0F0F7', // Light teal card - slightly darker than background
  surfaceDark: '#0F81A3', // Dark teal card - for emphasis
  surfaceGlow: '#B8F9E9', // Glowing teal - for special cards
  
  // Typography & Icons
  text: '#1A1A1A',       // Near black for primary text
  textSecondary: '#666666', // Medium grey for secondary text
  textTertiary: '#999999',  // Light grey for tertiary text
  textInverse: '#FFFFFF',   // White text for dark cards
  
  // Brand Accents - ClearScore Teal + Your Crimson
  accent: '#0F81A3',     // ClearScore Teal - primary brand color
  accentDark: '#0A5A75', // Darker teal for pressed states
  accentSoft: '#B8F9E9', // Light blue-teal for backgrounds
  accentGlow: 'rgba(15, 129, 163, 0.3)', // Teal glow for shadows
  
  // Secondary Brand - Your Automotive Crimson
  crimson: '#A50010',     // Unique automotive luxury identifier
  crimsonDark: '#7A000C', // Darker crimson
  crimsonSoft: '#F9B8B8', // Light red/pink (ClearScore pastel)
  crimsonGlow: 'rgba(165, 0, 16, 0.2)', // Crimson glow
  
  // Functional Colors - ClearScore Pastels
  success: '#7BC96F',    // Soft green for positive
  successSoft: '#CFF9B8', // Light green (ClearScore pastel)
  successGlow: 'rgba(123, 201, 111, 0.2)', // Green glow
  warning: '#F9DCB8',    // Soft peach/orange (ClearScore pastel)
  danger: '#E74C3C',     // Red for errors
  info: '#0F81A3',       // Teal for info
  
  // Structural
  border: '#D0E8ED',     // Light teal border
  divider: '#E6F7FA',    // Subtle teal divider
  shadow: '#0F81A3',     // Teal shadow
  shadowSoft: 'rgba(15, 129, 163, 0.08)', // Subtle teal shadow
};

// Comprehensive Design System Tokens
export const SHADOWS = {
  none: 'none',
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  // Teal glows for brand emphasis
  tealGlow: {
    shadowColor: '#0F81A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  tealGlowStrong: {
    shadowColor: '#0F81A3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  successGlow: {
    shadowColor: '#7BC96F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const TRANSITIONS = {
  fast: 150,
  base: 200,
  slow: 300,
} as const;

export const METRICS = {
  radius: RADIUS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  transitions: TRANSITIONS,
  screenWidth: width,
};

// Re-export for convenience
export { SPACING, TYPOGRAPHY };

export const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};
